using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ppwx.Models
{
    public class DoctorModels
    {
    }
    public class Doctor
    {
        /// 医生类
        /// <summary>
        /// 医生姓名

        /// </summary>
        public string id { get; set; }

        public string doc_name { get; set; }


        /// <summary>
        /// 部门id
        /// </summary>
        public string dept_id { get; set; }


        /// <summary>
        /// 工作时间
        /// </summary>
        public string work_time { get; set; }


        /// <summary>
        /// 挂号费用
        /// </summary>
        public string money { get; set; }


        /// <summary>
        /// 余号
        /// </summary>
        public string num { get; set; }


    }
}