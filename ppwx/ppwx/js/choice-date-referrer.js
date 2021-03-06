var app = angular.module("myApp", []);
app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});
app.controller("choice-date-referrer", ["$scope", "$http", "$location", "registerService", "$timeout", function ($scope, $http, $location, registerService, $timeout) {
    document.title = "选择就诊日期";
    $("#loading").show();
    $scope.timeghMsg="暂无数据";
    var funcId = angular.element(document.querySelector('#funcId')).val();
    $("body").css({"background": "#f6f6f6"});
    $scope.selectType = 0; //时间筛选初始化
    $scope.timeList = [];
    $scope.isFullAM = true; //是否满号 上午
    $scope.isFullPM = true; //是否满号 下午
    $scope.isFullOrder = true; //约满分时状态
    $scope.isNotAllowOrder = true; // 不可约状态
    $scope.isConfigStyle = '3';   //2:日期横向，直接显示时间段  3：日期横向，整点时间段伸缩
    $scope.outpDate = null;
    /**接收参数*/
    $scope.deptCode = $location.search().deptCode;
    $scope.doctorNo = $location.search().doctorNo;
    $scope.patientId = $location.search().patientId;
    var parttimetype = $location.search().parttimetype;
    $scope.amountOut="1";
    //parttimetype=3;
    $scope.scrollLeft = 0;
    if (parttimetype != null && parttimetype != undefined && parttimetype != '') {
        $scope.isConfigStyle = parttimetype;

    } else {
        parttimetype = 3;
    }


    function init() {
        $scope.morning = null;
        $scope.afternoon = null;
        $("#loading").show();
        $http({
            method: "post",
            url: "reservegh?cls=yygh&m=getparttimebytime",
            params: {
                "deptCode": $scope.deptCode,
                "funcId": funcId,
                parttimetype: parttimetype,
                doctorNo: escape($scope.doctorNo),
                outpDate: $scope.outpDate,
                patientId: $scope.patientId
            },
        }).success(function (data) {
            var partime_type= data.partime_type;
            if (partime_type != null && partime_type != undefined && partime_type != '') {
                $scope.isConfigStyle = partime_type;
            }
            $scope.isDocCard = data.isDocCard
            $scope.timeList = data.timelist;
            for (var i = 0; i < $scope.timeList.length; i++) {
                if ($scope.timeList[i].week == 'Mon') {
                    $scope.timeList[i].week = '周一'
                } else if ($scope.timeList[i].week == 'Tue') {
                    $scope.timeList[i].week = '周二'
                } else if ($scope.timeList[i].week == 'Wed') {
                    $scope.timeList[i].week = '周三'
                } else if ($scope.timeList[i].week == 'Thu') {
                    $scope.timeList[i].week = '周四'
                } else if ($scope.timeList[i].week == 'Fri') {
                    $scope.timeList[i].week = '周五'
                } else if ($scope.timeList[i].week == 'Sat') {
                    $scope.timeList[i].week = '周六'
                } else if ($scope.timeList[i].week == 'Sun') {
                    $scope.timeList[i].week = '周日'
                }
            }
            $scope.doctorInfo = data.doctorInfo;
            if (data != null && data != "" && data.rc == 1) {
                $scope.morning = data.morning;
                $scope.afternoon = data.afternoon;
                if ($scope.morning == null && $scope.afternoon == null) {
                    $("#choice_date_ref_nodate").show();
                }
            }else{
                if(data != null && data != ""&&data.rc==3){
                    $scope.timeghMsg=data.msg;
                    $scope.amountOut="2";
                }
            	if($scope.selectType != "info"){
                   $("#choice_date_ref_nodate").show();
            	}
			}
			$(function(){
                console.log($scope.scrollLeft);
                $("#canlender").scrollLeft($scope.scrollLeft);
            })
            window.scrollTo(0, 0);
            $("#loading").hide();
        });
    }

    init();


    $(function () {
        var $Rheight = document.documentElement.clientHeight;
        var $changeTop = $("#choice-date-referrer .choice_date_top_wrap").outerHeight();
        $("#choice-date-referrer .choice_date_cont_wrap").css({
            "height": $Rheight + "px",
            "padding-top": parseInt($changeTop + 3) + "px"
        })
        $("#slider_cursor_img").addClass("isCursorAnimate");
        $timeout(function () {
            $("#slider_cursor_img").removeClass("isCursorAnimate");
        }, 2000)
    })
    $scope.closeCursorTips = function () {
        registerService.shutGuiderMsg("#slider_cursor_wrapper");
        $(".prompt_disabled_wrapper").removeClass("pageFixed");
    };
    // 预约提示
    $scope.goOrderRegister = function (parttime, type) {
        var schedule = '';
        if (parttime.regFlag != 1) {
            return;
        }

        if (type == 1) {
            schedule = $scope.morning.scheduleInfo;
        } else if (type == 2) {
            schedule = $scope.afternoon.scheduleInfo;
        }

        var ptimeinterval = null;
        if (parttime.startTime != null && parttime.startTime != "" && parttime.endTime != null && parttime.endTime != '') {
            ptimeinterval = parttime.startTime + " - " + parttime.endTime;
        } else if (parttime.startTime != null && parttime.startTime != "" && (parttime.endTime == null || parttime.endTime == '')) {
            ptimeinterval = parttime.startTime
        } else if ((parttime.startTime == null || parttime.startTime == "") && parttime.endTime != null && parttime.endTime != '') {
            ptimeinterval = parttime.endTime;
        }
        $location.path("/yygh-register-info").search({
            registerfee: schedule.reserveFee,
            outpdate: schedule.outpDate,
            scheduleid: schedule.scheduleId,
            timeinterval: schedule.timeInterval,
            currWeek: schedule.week,
            registrationfee: schedule.registrationFee,
            clinicfee: schedule.clinicFee,
            outptyp: schedule.outpType,
            doctor_title: $scope.doctorInfo.doctor_title,
            deptCode: $scope.doctorInfo.dept_code,
            doctorNo: $scope.doctorInfo.doctor_no,
            PartTimeId: parttime.partTimeId,
            ptimeinterval: ptimeinterval,
            querycode: parttime.querycode,
        })

    }

    // 取消挂号
    $scope.cancleRegister = function () {
        registerService.shutMsg("#register_notes_prompt");
        $(".prompt_disabled_wrapper").removeClass("pageFixed");
    }

    // 继续挂号
    $scope.goRegister = function () {
        registerService.shutMsg("#register_notes_prompt");
        $(".prompt_disabled_wrapper").removeClass("pageFixed");
    }

    // 切换挂号时间
    $scope.changeType = function (type, item) {//tab切换的事件
        $scope.selectType = type;
        $("#choice_date_ref_nodate").hide();
        $scope.scrollLeft = $("#canlender").scrollLeft();

        if ($scope.selectType != "info") {
            $scope.timeList = {};
            $scope.doctorInfo = {};
            $scope.morning = {};
            $scope.afternoon = {};
            $scope.outpDate = item.outpDate;
            init();
        }

        window.scrollTo(0, 0);
    }

    // 展开收起分时
    $scope.openDetail = function (event) {
        if ($(event.currentTarget).parent(".choice_cont_box").hasClass("will_open_detail")) { //收起
            if ($(event.currentTarget).parent(".choice_cont_box").hasClass("had_full_order")) {
                $(event.currentTarget).parent(".choice_cont_box").removeClass("will_open_detail").addClass("had_open_detail")
            } else {
                $(event.currentTarget).parent(".choice_cont_box").removeClass("will_open_detail").addClass("had_open_detail")
                $(event.currentTarget).children(".date_control_box").find(".btn_control font").html("收起");
            }
        } else { //取消关注
            if ($(event.currentTarget).parent(".choice_cont_box").hasClass("had_full_order")) {
                $(event.currentTarget).parent(".choice_cont_box").addClass("will_open_detail").removeClass("had_open_detail")
            } else {
                $(event.currentTarget).parent(".choice_cont_box").addClass("will_open_detail").removeClass("had_open_detail")
                $(event.currentTarget).children(".date_control_box").find(".btn_control font").html("预约");
            }
        }
    }


    // 添加关注
    $scope.addAttention = function (event, doctor) {
        if ($(event.currentTarget).hasClass("willCollect")) { //添加关注
            $http({
                method: "post",
                url: "reservegh?cls=yygh&m=addDoctorconcern",
                params: {
                    "deptCode": doctor.dept_code,
                    "doctorNo": doctor.doctor_no,
                    "isConcern": 1
                },//1代表搜索;
            }).success(function (data) {
                if (data.rc == 1) {
                    $scope.doctorInfo.is_collect = 1;
                    registerService.openMsg("收藏成功", "bg-color1");
                } else {
                    registerService.openMsg(data.msg, "bg-color1");
                }
            });
        } else { //取消关注
            $http({
                method: "post",
                url: "reservegh?cls=yygh&m=addDoctorconcern",
                params: {
                    "deptCode": doctor.dept_code,
                    "doctorNo": doctor.doctor_no,
                    "isConcern": 2
                },//1代表搜索;
            }).success(function (data) {
                if (data.rc == 1) {
                    $scope.doctorInfo.is_collect = 2;
                    registerService.openMsg("已取消收藏", "bg-color1");
                } else {
                    registerService.openMsg(data.msg, "bg-color1");
                }
            });
        }
    }

    // 医生名片
    $scope.goDoctorCardCase = function (doctor) {
        $location.path("/doctor-cardcase").search({
            deptCode: doctor.dept_code,
            doctorNo: doctor.doctor_no,
            doctor_image_small: escape(doctor.doctor_image_small)
        })
    }
}]);