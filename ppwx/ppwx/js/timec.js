var app = angular.module("myApp",[]);
app.controller("choice-time-referrer", ["$scope", "$http", "$location","registerService", function($scope, $http, $location,registerService) {
	document.title = "ѡ��ʱ���";
	$("body").css({"background":"#f6f6f6"});
    $("#loading").show();
    var funcId = angular.element(document.querySelector('#funcId')).val();
	$scope.isFullAM = true ; //�Ƿ����� ����
	$scope.isFullPM = true ; //�Ƿ����� ����
	$scope.isFullOrder = true ; //Լ����ʱ״̬
	$scope.isNotAllowOrder=true; // ����Լ״̬
	$scope.isConfigStyle = '2';   //2:���ں���ֱ����ʾʱ���  3�����ں�������ʱ�������

	/**���ղ���*/
    $scope.registerfee=$location.search().registerfee;
	$scope.outpdate=$location.search().outpdate;
	$scope.scheduleid=$location.search().scheduleid;
	$scope.timeinterval=$location.search().timeinterval;
	console.log($scope.timeinterval);
	$scope.currWeek=$location.search().currWeek;
	$scope.registrationfee=$location.search().registrationfee;
	$scope.clinicfee=$location.search().clinicfee;
	$scope.outptyp=$location.search().outptyp;
	$scope.doctor_title=$location.search().doctor_title;
	$scope.deptCode=$location.search().deptCode;
	$scope.doctorNo=$location.search().doctorNo;
	var parttimetype=$location.search().parttimetype;
	if(parttimetype!=null&&parttimetype!=undefined&&parttimetype!=''){
        $scope.isConfigStyle=parttimetype;
	}
    $scope.noDatamsg='���޷�ʱ��Ϣ';
    $http({
        method: "post",
        url: "reservegh?cls=yygh&m=getpointparttime",
        params:{"scheduleid":escape($scope.scheduleid),"funcId":funcId,parttimetype:parttimetype},
    }).success(function (data) {
        if (data != null && data != "") {
        	if(data.rc==1){
                console.log(data);
                if(parttimetype==2 || parttimetype==4){
                    $scope.apartTimes=data.apartTimes;
                    $scope.ppartTimes=data.ppartTimes;
                }else{
                    $scope.atempInfo=data.atempInfo;
                    $scope.ptempInfo=data.ptempInfo;
                }
			}else{
             if(data.rc==3){
                    $scope.noDatamsg=data.msg;
                 registerService.openMsg(data.msg,"bg-color5");
                }
                $("#chioceTime").show();
            }
        }
        $("#loading").hide();
    });

	// չ�������ʱ
	$scope.openDetail = function(event){
		if($(event.currentTarget).parent(".choice_cont_box").hasClass("will_open_detail")){ //����
			if($(event.currentTarget).parent(".choice_cont_box").hasClass("had_full_order")){
				$(event.currentTarget).parent(".choice_cont_box").removeClass("will_open_detail").addClass("had_open_detail")
			}else{
				$(event.currentTarget).parent(".choice_cont_box").removeClass("will_open_detail").addClass("had_open_detail")
				$(event.currentTarget).children(".date_control_box").find(".btn_control font").html("����");
			}
		}else{ //ȡ����ע
			if($(event.currentTarget).parent(".choice_cont_box").hasClass("had_full_order")){
				$(event.currentTarget).parent(".choice_cont_box").addClass("will_open_detail").removeClass("had_open_detail")
			}else{
				$(event.currentTarget).parent(".choice_cont_box").addClass("will_open_detail").removeClass("had_open_detail")
				$(event.currentTarget).children(".date_control_box").find(".btn_control font").html("ԤԼ");
			}
		}
	}

    // �Һ�
    $scope.goOrderRegister = function (schedule) {
        if(schedule.regFlag==1){
            var ptimeinterval=null;
            if(schedule.startTime!=null &&schedule.startTime!="" &&schedule.endTime!=null &&schedule.endTime!=''){
                ptimeinterval=schedule.startTime+" - "+schedule.endTime;
            }else if(schedule.startTime!=null &&schedule.startTime!="" &&(schedule.endTime==null || schedule.endTime=='')){
                ptimeinterval=schedule.startTime
            }else if((schedule.startTime==null || schedule.startTime=="") &&schedule.endTime!=null && schedule.endTime!=''){
                ptimeinterval=schedule.endTime;
            }
            $location.path("/yygh-register-info").search({
				registerfee:$scope.registerfee,
				outpdate:$scope.outpdate,
				scheduleid:$scope.scheduleid,
				timeinterval:$scope.timeinterval,
				currWeek:$scope.currWeek,
                registrationfee:$scope.registrationfee,
				clinicfee:$scope.clinicfee,
				outptyp:$scope.outptyp,
				doctor_title:$scope.doctor_title,
				deptCode:$scope.deptCode,
				doctorNo:$scope.doctorNo,
				PartTimeId:schedule.partTimeId,
                ptimeinterval:ptimeinterval,
				querycode:schedule.querycode})
        }else{
            return;
        }
    };

}]);