/*!
 * =====================================================
 * vdn v2018.2.3 (http://www.vesn.net)
 * =====================================================
 */
/*简化ajax操作,统一返回json格式，成功触发f_ok函数，错误则触发f_error函数*/
var vdn = {
	APIURL: "/api",
	MSGURL: "/msg",
	URL: "", //每次都会被清空
	async: true, //异步
	timeout: 10000, //超时10秒
	__responseWin: {}, //响应窗体
	__responseWin_current: "", //当前响应窗体
	__responseOpens: new Array(), //已经打开的Picker
	__responseOpenCount: 0, //打开的Picker数量
};
! function(a, $) {
	//GET API
	a.get = function(data, f_ok, f_error) {
		return a.ajax("GET", 'application/x-www-form-urlencoded', data, f_ok, f_error, true);
	}
	//POST API
	a.post = function(data, f_ok, f_error) {
		return a.ajax("POST", 'application/json', JSON.stringify(data), f_ok, f_error, false);
	}
	//ajax提交页面所有子组件
	a.submitAll = function(data, f_ok, f_error) {
		return a.submit("", data, f_ok, f_error);
	}
	//ajax提交窗体或容器子组件
	a.submit = function(id, data, f_ok, f_error) {
		var str;
		if(id.length == 0) {
			str = $(":input").serialize();
		} else {
			var _parent = $("#" + id);
			if(_parent.is("form")) {
				str = _parent.serialize();
			} else {
				str = $("#" + id + " :input").serialize();
			}
		}
		if(typeof(data.params) == "undefined") {
			str = "method=" + encodeURIComponent(data.method) + "&" + str;
		} else {
			str = "method=" + encodeURIComponent(data.method) + "&params=" + encodeURIComponent(data.params) + "&" + str;
		}

		return a.ajax("POST", 'application/x-www-form-urlencoded', str, f_ok, f_error, false);
	}
	//upfile 上传文件 obj可以為FormData或者formID\divID\fileID
	a.upfile = function(obj, data, f_ok, f_error) {
		var fileObj;
		if (typeof obj=="object") {
			fileObj=obj;
		} else if(obj.length == 0) {
			str = $(":input").serialize();
		} else {
			var _parent = $("#" + obj);
			if(_parent.is("form")) {
				fileObj = new FormData($("#" + obj)[0]);
			} else {
				var _files;
				if (_parent.is("div")) {
					_files = $("#" + obj +" :file");
				} else if($("#" + obj).prop("type")=="file") {
					_files = _parent;
				}
				if (typeof(_files) != "undefined" && _files.length >0) {
					fileObj = new FormData();
					_files.each(function(index,item){
						for (var i = 0; i < item.files.length; i++) {
							fileObj.append(item.id,item.files[i]);
						}
					});
				}
			}
		}
		if(typeof(fileObj) == "undefined") {
			f_error({
				Message: "undefined " + formid,
				Code: -9001
			});
			return;
		}
		if(fileObj.size <= 0) {
			f_error({
				Message: "Invalid file count",
				Code: -9002
			});
			return;
		}
		//追加参数
		fileObj.append("method", data.method);
		if(data.params != undefined) {
			fileObj.append("params", data.params);
		}
		return a.ajax("POST", false, fileObj, f_ok, f_error, false);
	}
	//对form的组件值进行初始化 JSON格式{"id":"value","id":"value"...}
	a.iniform = function(data) {
		$.each(data.Result, function(name, value) {
			var obj = $("#" + name);
			if(obj.length > 0) {
				obj.val(value);
				//触发选择框的change事件，以便联动数据
				if($("#" + name).prop("tagName") == "SELECT") {
					obj.trigger("change");
				}
			}
		});
	}
	a.ajax = function(Type, CType, Data, f_ok, f_error, Process) {
		if(a.URL.length == 0) {
			a.URL = a.APIURL;
		}
		a.ajaxEx(a.URL, Type, CType, Data, f_ok, f_error, a.async, Process, a.timeout);
		//clear
		a.URL = "";
	}
	a.ajaxEx = function(URL, Type, CType, Data, f_ok, f_error, Async, Process, Timeout) {
		try {
			var vAjax = $.ajax({
				url: URL,
				async: Async,
				type: Type,
				data: Data,
				dataType: 'json',
				contentType: CType,
				cache: false,
				processData: Process,
				timeout: Timeout, //默认超时10秒
				beforeSend: function() {},
				success: function(data, status, xhr) {
					if(data.Error == null) {
						if(f_ok) {
							f_ok(data);
						}
					} else {
						if(f_error) {
							f_error(data.Error);
						}
					}
				},
				error: function(xhr, error, exception) {
					//ajax 发生错误 
					if(f_error) {
						f_error({
							Message: error + ":" + exception.toString(),
							Code: -9099
						});
					}
				},
				complete: function(xhr, status) { //请求完成后最终执行参数
					//超时,status:success,error,timeout...
					if(status == 'timeout') {
						vAjax.abort();　
						if(f_error) {　　　　
							//触发错误
							f_error({
								Message: "timeout",
								Code: -9098
							});
						}
					}　　
				}
			});
		} catch(e) {
			//代码发生异常
			f_error({
				Message: e.name + ":" + e.message,
				Code: -9097
			});
		}
	}

	//Template
	a.appendTo = function(id, fmt, data, options) {
		try {
			a.templateEx(id, fmt, data, true, options);
		} catch(e) {
			//console.error(e);
		}
	}
	a.prependTo = function(id, fmt, data, options) {
		try {
			a.templateEx(id, fmt, data, false, options);
		} catch(e) {
			//console.error(e);
		}
	}
	a.templateEx = function(id, fmt, data, append, options) {
		/* Compile the markup as a named template */
		var tmpl_1;
		if(typeof fmt == "object") {
			tmpl_1 = fmt;
		} else {
			tmpl_1 = $('<script type="text/x-jquery-tmpl">' + fmt + '</script>');
		}
		//filter
		if(!(id[0] == "." || id[0] == "#")) {
			id = "#" + id;
		}
		//Appent to List
		if(append) {
			tmpl_1.tmpl(data, options || {}).appendTo(id);
		} else {
			tmpl_1.tmpl(data, options || {}).prependTo(id);
		}
	}
	//Trace
	a.trace = function(msg) {
		try {
			//判断msg的类别
			var sMsg = "";
			if(typeof msg === "string") {
				sMsg = msg;
			} else {
				sMsg = JSON.stringify(msg);
				if(sMsg == undefined || sMsg.length == 0) {
					sMsg = String(msg);
				}
			}
			if(sMsg.length == 0) {
				sMsg = " ";
			}
			var data = {
				to: "group:Trace",
				msgtype: "trace",
				msg: sMsg
			};
			var jsonStr = JSON.stringify(data);
			$.ajax({
				url: a.MSGURL,
				type: 'POST',
				data: jsonStr,
				contentType: 'application/json',
				success: function(data, status, xhr) {
					if(data.substring(0, 7) == "succeed") {
						//ok
					} else {
						//Error 系统返回错误信息
						alert("Trace Error(1):" + data);
					}
				},
				error: function(xhr, error, exception) {
					//ajax 发生错误    
					alert("Trace Error(2):" + error + " " + exception.toString() + " (status:" + xhr.status + " state:" + xhr.readyState + ")");
				}
			});
		} catch(e) {
			//代码发生异常
			alert("Trace Error(3):" + e.name + ":" + e.message + " code:" + e.number);
		}
		return false;
	}
	//点击返回直接回到指定页面
	a.setBack = function(tourl) {
		var local = $(location).attr('href');
		tourl = tourl || "/";
		if(window.history && window.history.pushState) {
			window.history.replaceState({
				title: "main",
				url: tourl
			}, "page", tourl);
			window.history.pushState({
				title: "page",
				url: local
			}, "page", local);　　
			$(window).on('popstate', function(e) {
				if(window.history.state != null && window.history.state.url == tourl) {
					$(location).prop('href', tourl);
				}
			});　　
		}
	}
	//禁止返回
	a.disableBack = function() {
		if(window.history && window.history.pushState) {
			window.history.pushState({
				title: "page",
				url: "#"
			}, "page", "#");　　
			$(window).on('popstate', function() {　
				window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
				　　
				window.history.forward(1);
			});　　
		}
	}
	//选择对话框 picker
	$(".vdn-response-content").css("position", "relative"); //控制位置
	$(".vdn-response").each(function(index, item) {
		item.mask = mui.createMask(function() {
			return item.mask.closed;
		});
		item.mask.closed = true; //关闭标志
		item.mask.first = true; //第一次打开标志
		//add array
		a.__responseWin[item.id] = item.mask;
		item.mask.show();
		//背景色是否半透明
		if($(item).attr("alpha") != "true") {
			$(item).css("background-color", "white");
		} else {
			$(item).children(".mui-content").css("background-color", "rgba(0,0,0,0)");
		}
		//bar
		if($(item).attr("showbar") != "false") {
			//buttons
			var buttons = ["取消", "确定"];
			if($(item).attr("buttons")) {
				buttons = ($(item).attr("buttons") + ",").split(",");
			}
			var ls_bar = '<header class="mui-bar mui-bar-nav vnd-fixed">';
			if(buttons[0].length > 0) {
				ls_bar += '<button type="button" class="mui-btn mui-btn-red mui-pull-left" onclick="vdn.cancelResponse();return false;">' + buttons[0] + '</button>';
			}
			if(buttons[1].length > 0) {
				ls_bar += '<button type="button" class="mui-btn mui-btn-blue mui-pull-right" onclick="vdn.confirmResponse();return false;">' + buttons[1] + '</button>';
			}
			//标题
			if($(item).attr("title")) {
				ls_bar += '<h1 class="mui-title">' + $(item).attr("title") + '</h1>';
			}
			ls_bar += '</header>';
			$(item).prepend($(ls_bar));
		}
		//追加到记录数组
		$(item.mask).append(item);
		//set content height 减去vnd-fixed的高度
		var fixeds = $(item).find(".vnd-fixed")
		if(fixeds.length > 0) {
			var fixHeight = 0;
			fixeds.each(function(index, fixed) {
				//outerHeight有时不能准确的测量高度,就需要遍历子组件
				var subHeight = $(fixed).outerHeight(true);
				if(subHeight == 0) {
					$(fixed).find("[position!='absolute']").each(function(index, sub) {
						if($(sub).outerHeight(true) > subHeight) {
							subHeight = $(sub).outerHeight(true);
						}
					})
				}
				fixHeight += subHeight;
			});
			$(item).find(".vdn-response-content").height($(item.mask).height() - fixHeight);
		} else {
			$(item).find(".vdn-response-content").height($(item.mask).height());
		}
		//去掉隐藏标识
		$(item).css("display", "block");
		//关闭
		item.mask.close();
	});
	//绑定事件
	//========控制选择项 vdn-select-item(单选) vdn-select-item-multy(多选)=====
	//导航项
	$(".vdn-response").on("tap", ".vdn-select-item[nav]", function() {
		//移除选择标志
		$(".vdn-select-item[nav='" + $(this).attr("nav") + "']").removeClass("vdn-selected")
		//标志选择
		$(this).addClass("vdn-selected");
		//触发事件changed
		a.__triggerChanged(this)
	})
	//单选
	$(".vdn-response").on("tap", ".vdn-select-item:not([nav])", function() {
		//移除选择标志
		$(".vdn-select-item:not([nav])").removeClass("vdn-selected")
		//标志选择
		$(this).addClass("vdn-selected");
		//触发事件changed
		a.__triggerChanged(this)
	})
	//多选
	$(".vdn-response").on("tap", ".vdn-select-item-multy", function() {
		//多选
		if($(this).hasClass("vdn-selected")) {
			//移除选择标志
			$(this).removeClass("vdn-selected");
		} else {
			//标志选择
			$(this).addClass("vdn-selected");
		}
		//触发事件changed
		a.__triggerChanged(this)
	})

	//打开选择Response
	//p{id,ini,confirm,cancel,changed}
	a.openResponse = function(p) {
		a.__responseWin[p.id].closed = false;
		//点击确定触发
		a.__responseWin[p.id].confirm = p.confirm;
		//点击取消触发
		a.__responseWin[p.id].cancel = p.cancel;
		//选择项发生改变
		a.__responseWin[p.id].changed = p.changed;
		//current
		a.__responseOpenCount++;
		a.__responseOpens[a.__responseOpenCount - 1] = p.id;
		a.__responseWin_current = p.id;
		a.__responseWin[a.__responseWin_current].show();
		//ini 初始化事件
		if(p.ini) {
			p.ini(a.__responseWin[a.__responseWin_current].first)
		}
		if(a.__responseWin[a.__responseWin_current].first) {
			a.__responseWin[a.__responseWin_current].first = false;
		}
	};

	a.onResponseClose = function() {
		if(a.__responseWin[a.__responseWin_current]._show == false) {
			a.__responseOpenCount--;
			if(a.__responseOpenCount > 0) {
				a.__responseWin_current = a.__responseOpens[a.__responseOpenCount - 1];
			} else {
				a.__responseWin_current = "";
			}
		}
	}
	//点击确定时调用
	a.confirmResponse = function() {
		if(a.__responseWin[a.__responseWin_current].confirm) {
			a.__responseWin[a.__responseWin_current].closed = a.__responseWin[a.__responseWin_current].confirm();
		} else {
			a.__responseWin[a.__responseWin_current].closed = true;
		}
		a.__responseWin[a.__responseWin_current].close();
		a.onResponseClose();
	};
	//点击取消时调用
	a.cancelResponse = function() {
		if(a.__responseWin[a.__responseWin_current].cancel) {
			a.__responseWin[a.__responseWin_current].closed = a.__responseWin[a.__responseWin_current].cancel();
		} else {
			a.__responseWin[a.__responseWin_current].closed = true;
		}
		a.__responseWin[a.__responseWin_current].close();
		a.onResponseClose();
	};
	//清除项目并将滚动条移动到顶部
	a.clearItems = function(id) {
		item = $("#" + id);
		if(item.length > 0) {
			item.empty();
			//滚动条到顶部
			wrapper = item.closest(".mui-scroll-wrapper");
			if(wrapper.length > 0) {
				mui(wrapper[0]).scroll().scrollTo(0, 0, 1);
			}
		}
	}
	//触发选择改变事件
	a.__triggerChanged = function(item) {
		if(a.__responseWin[a.__responseWin_current].changed) {
			a.__responseWin[a.__responseWin_current].changed(item, $(item).attr("nav") != undefined);
		}
	}
	//清除选择项,只能在Ini函数中使用
	a.clearSelected = function() {
		$(a.__responseWin[a.__responseWin_current]).find("[class*='vdn-select-item']:not([nav])").removeClass("vdn-selected");
	};

	//选中nav项目 根据text值或者index
	a.selectItem = function(parm) {
		var item;
		if(typeof parm == "string") {
			$(a.__responseWin[a.__responseWin_current]).find("[class*='vdn-select-item']:contains('" + parm + "'):not([nav])").each(function() {
				if($(this).text() == parm) {
					item = $(this)
				}
			});
		} else {
			//根据索引
			var items = $(a.__responseWin[a.__responseWin_current]).find("[class*='vdn-select-item']:not([nav])");
			if(items.length > parm) {
				item = $(items[parm]);
			}
		}
		//选择
		if(item) {
			//单选清空选择
			if(item.hasClass("vdn-select-item-multy") == false) {
				a.clearSelected()
			}
			item.addClass("vdn-selected");
			//触发事件changed
			a.__triggerChanged(item[0])
		}
	}
	//清除选择项,只能在Ini函数中使用
	a.clearSelectedNav = function(nav) {
		$(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item[nav='" + nav + "']").removeClass("vdn-selected");
	};
	//选中nav项目 根据text值或者index
	a.selectItemNav = function(nav, parm) {
		var item;
		if(typeof parm == "string") {
			$(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item:contains('" + parm + "')[nav='" + nav + "']").each(function() {
				if($(this).text() == parm) {
					item = $(this)
				}
			});
		} else {
			//根据索引
			var items = $(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item[nav='" + nav + "']");
			if(items.length > parm) {
				item = $(items[parm]);
			}
		}
		//选择
		if(item) {
			//清空选择
			a.clearSelectedNav(nav)
			item.addClass("vdn-selected");
			//触发事件changed
			a.__triggerChanged(item[0])
		}
	}
	//返回选择的项,单选返回{item,value},多选返回{items[],value[]},导航项标明nav值
	a.getSelectedItem = function(nav) {
		if(nav) {
			//导航
			var selected = $(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item.vdn-selected[nav='" + nav + "']");
			return {
				item: selected,
				value: selected.text(),
				multy: false
			};
		} else {
			//自动判断你是多选还是单选,单选返回单个值,多选返回数组
			var selected = $(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item-multy");
			if(selected.length == 0) {
				//单选
				selected = $(a.__responseWin[a.__responseWin_current]).find(".vdn-select-item.vdn-selected:not([nav])");
				return {
					item: selected,
					value: selected.text(),
					multy: false
				};

			} else {
				//多选
				selected = selected.filter(".vdn-selected");

				var list = [];
				selected.each(function(index, item) {
					list.push(item.innerText);
				})
				return {
					item: selected,
					value: list,
					multy: true
				};
			}
		}
		return {
			item: selected,
			value: "",
			multy: false
		}
	}
	//直接返回选择的值,单选返回单个值,多选返回数组.... ,导航项标明nav值
	a.getSelectedValue = function(nav) {
		var selected = a.getSelectedItem(nav);
		return selected.value;
	}

}(vdn, jQuery)

$(function() {
	$("[type='text/x-jquery-tmpl']:not(script)").each(function() {
		$(this).contents().unwrap().wrapAll("<script id='" + $(this).prop("id") + "' type='text/x-jquery-tmpl' />");
	});
});

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return decodeURI(r[2]);
	return null; //返回参数值
}