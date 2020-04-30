using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.OracleClient;

namespace ppwx.Models
{
    public class User
    {
        //用户类



        /// <summary>
        /// 用户id
        /// </summary>
        public string id { get; set; }


        /// <summary>
        /// 用户名
        /// </summary>
        public string username { get; set; }


        /// <summary>
        /// 用户姓名
        /// </summary>
        public string name { get; set; }


        /// <summary>
        /// 性别
        /// </summary>
        public string sex { get; set; }


        /// <summary>
        /// 年龄
        /// </summary>
        public string age { get; set; }


        /// <summary>
        /// 电话
        /// </summary>
        public string tel { get; set; }


        /// <summary>
        /// 身份证号
        /// </summary>
        public string idcard { get; set; }


        /// <summary>
        /// 地址
        /// </summary>
        public string address { get; set; }


        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }






    }
}