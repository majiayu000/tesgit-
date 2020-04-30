using ppwx.Models;
using ppwx.TencentCloud;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OracleClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.ModelBinding;
using System.Web.Mvc;
using TencentCloud;

namespace ppwx.Controllers
{
    public class HomeController : Controller
    {

        #region 默认主页
        public ActionResult Index()
        {
            

                return View();
            
        }
        #endregion

        #region SENDSMS
        public ActionResult SendSms()
        {
            SendSms sen = new SendSms();
            sen.Send();

         //需改进内容：验证码随机  手机号录入等

            return View();

        }
        #endregion

        #region 注册页
        public ActionResult Register()
        {
            return View();
        }
        #endregion

        #region 测试页面
        public ActionResult login()
        {
            var ss = Server.MapPath("/");  //获得本机的绝对路径

            // ss = (ss.Replace("Home", "Views")).Replace("home", "Views");
            // ss = ss + "\\Views";
            ss = ss + "/home/login.html";
            using (StreamReader sr = new StreamReader(ss, System.Text.Encoding.GetEncoding("UTF-8"))) //以gb2312编码方式读取
            {
                string htmlContent = sr.ReadToEnd();

                return Content(htmlContent);
            }
        }
        #endregion

        #region codc
        public ActionResult cd()
        {
            return View();
        }
        #endregion

        #region 修改密码页面
        public ActionResult Change()
        {
            return View();
        }
        #endregion




        #region 预约页面
        public ActionResult Yuyue()
        {
            

                return View();
          
        }
        #endregion

        #region details
        public ActionResult Details()
        {
            var doctors = new List<Doctor>
            {
                new Doctor{ doc_name = "www" },
                 new Doctor{ doc_name = "ww33w" },
                  new Doctor{ doc_name = "w3ww" },
            };
            return View(doctors);
        }
        #endregion



        #region 个人信息页面
        public ActionResult UserInfo()
        {
            var usrname = System.Web.HttpContext.Current.Session["usrName"];
            //if (name == null)
            //{
            //    return();
            //}
            OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);//进行连接
            conn.Open();//打开指定的连接         
            string sel = "select name,sex,age,address,tel from wx_register where username ='" + usrname + "'";
            //得到用户信息
            OracleDataAdapter adapter = new OracleDataAdapter(sel, conn);
            DataSet user = new DataSet();
            adapter.Fill(user, "User");


            OracleCommand command1 = new OracleCommand(sel, conn);
            OracleDataReader reader = command1.ExecuteReader();

            List<User> d1 = new List<User>();

            while (reader.Read())
            {
                User d0 = new User();

                d0.name = reader["name"].ToString();
                d0.sex = reader["sex"].ToString();
                d0.age = reader["age"].ToString();
                d0.address = reader["address"].ToString();
                d0.tel = reader["tel"].ToString();
                d1.Add(d0);
            }
            return View(d1);
        }
        #endregion

        #region 主页面
        public ActionResult MainPage()
        {


            return View();
        }
        #endregion




        #region 检测用户名唯一
        public JsonResult RegisterCheckName(string usename)
        {
            JsonResult jr = new JsonResult();
            jr.Data = RegisterCheakUserByName(usename);//泛型集合
            //json字符串，[{id:"123",name:"li"},{id:"456",name:"zhao"}],有规则的字符串
            jr.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            //return Json(jr.Data, JsonRequestBehavior.AllowGet);
            //JsonRequestBehavior  = JsonRequestBehavior.AllowGet;
            return jr;
        }
        public string RegisterCheakUserByName(string usename)
        {



            OracleConnection conn = new OracleConnection("Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.15.50) (PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=payy)));Persist Security Info=True;User Id=hos; Password=hos");//进行连接
            conn.Open();//打开指定的连接         
            string che = "select * from wx_register where username = '" + usename + "'";
            OracleCommand command1 = new OracleCommand(che, conn);
            string ret = command1.ExecuteNonQuery().ToString();

            if (command1.ExecuteScalar() != null)
            {
                return "1";

            }
            else
            {
                return "0";
            }


        }


        #endregion

        #region 注册方法
        public JsonResult RegisterInsertData(string usename, string pass, string name, string sex, string age, string idcard, string address, string tel)
        {
            JsonResult jr = new JsonResult();
            jr.Data = RegisterInsertUserByName(usename, pass, name, sex, age, idcard, address, tel);//泛型集合
            //json字符串，[{id:"123",name:"li"},{id:"456",name:"zhao"}],有规则的字符串
            jr.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            //return Json(jr.Data, JsonRequestBehavior.AllowGet);
            //JsonRequestBehavior  = JsonRequestBehavior.AllowGet;
            return jr;
        }
        public string RegisterInsertUserByName(string usename, string pass, string name, string sex, string age, string idcard, string address, string tel)
        {

            if (name == null || name == "")
            {
                return null;//有待考虑修改
            }
            else
            {
                //string ins = "insert into LXK_WEIXIN (usename,password) values ('" + name + "','" + pass + "')";
                // Oracled l = new Oracled();
                // l.read(ins);

                OracleConnection conn = new OracleConnection("Data Source=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.15.50) (PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=payy)));Persist Security Info=True;User Id=hos; Password=hos");//进行连接
                conn.Open();//打开指定的连接         
                string ins = "insert into wx_register (username,password,name,sex,age,idcard,address,tel) values ('" + usename + "','" + pass + "','" + name + "','" + sex + "','" + age + "','" + idcard + "','" + address + "','" + tel + "')";
                OracleCommand command1 = new OracleCommand(ins, conn);
                string ret = command1.ExecuteNonQuery().ToString();

                if (ret == "1")//注册成功
                {
                    return ret;
                }
                else//注册失败
                {
                    return "0";
                }

            }
        }
        #endregion

        #region 登录方法
        public JsonResult LoginIn(string name, string pass)
        {
            JsonResult jr = new JsonResult();
            jr.Data = Loginbyname(name, pass);//泛型集合
            //json字符串，[{id:"123",name:"li"},{id:"456",name:"zhao"}],有规则的字符串
            return jr;
        }

        public string Loginbyname(string name, string pass)
        {
            OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);//进行连接
            conn.Open();//打开指定的连接         
            string sel = "select * from wx_register where username = '" + name + "' and password = '" + pass + "'";
            OracleCommand command1 = new OracleCommand(sel, conn);

            //int ret = Convert.ToInt32(command1.ExecuteScalar());
            //string ret = command1.ExecuteScalar().ToString();

            if (command1.ExecuteScalar() != null)
            {
                System.Web.HttpContext.Current.Session["usrName"] = name;
                return "1";


            }
            else
            {
                return "0";
            }



        }
        #endregion

        #region 登出
        public ActionResult logout()
        {


            System.Web.HttpContext.Current.Session["usrName"] = null;  //清空session

            //var ss = Server.MapPath("/");  //获得本机的绝对路径

            //// ss = (ss.Replace("Home", "Views")).Replace("home", "Views");
            //// ss = ss + "\\Views";
            //ss = ss + "/Views/home/index.cshtml";
            //using (StreamReader sr = new StreamReader(ss, System.Text.Encoding.GetEncoding("UTF-8"))) //以gb2312编码方式读取
            //{
            //    string htmlContent = sr.ReadToEnd();

            //    return Content(htmlContent);
            //}
           
            return View("Index");
        }
        #endregion

        #region 修改密码方法通过密码
        public JsonResult ChangePassword(string pass, string pass1)
        {
            JsonResult pr = new JsonResult();
            pr.Data = ChangeP(pass, pass1);//泛型集合
            //json字符串，[{id:"123",name:"li"},{id:"456",name:"zhao"}],有规则的字符串
            return pr;
        }

        public string ChangeP(string pass, string pass1)
        {

            OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);//进行连接
            var name = System.Web.HttpContext.Current.Session["usrName"];
            if (name == null)
            {
                return "2";
            }

            //try
            //{

            conn.Open();
            string cha = "update  wx_register set password='" + pass1 + "' where username ='" + name + "' and password ='" + pass + "'";
            OracleCommand command1 = new OracleCommand(cha, conn);
            string ret = command1.ExecuteNonQuery().ToString();

            if (ret == "1")
            {
                System.Web.HttpContext.Current.Session["usrName"] = null;  //清空session
                return ret;
            }
            else
            {
                return "0";
            }

            //}
            //catch (Exception ex)
            //{
            //    return "0";
            //}
            //finally
            //{
            //    conn.Close();
            //}
        }
        #endregion

        #region 选择科室（yuyue） 开始方法
        public JsonResult ChooseDep(string id)
        {
            JsonResult jr = new JsonResult();
            jr.Data = GetById(id);//泛型集合
            //json字符串，[{id:"123",name:"li"},{id:"456",name:"zhao"}],有规则的字符串
            return jr;
        }

        public string GetById(string id)
        {

            //var re = "";
            //var doct = new Doctor { }; 
            //string doc_name="";
            OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);//进行连接
            conn.Open();//打开指定的连接         
            string sel = "select * from DOCTOR_STATUS where DEP_ID ='" + id + "'";

            //从医生状态表搜索 科室id  得到预约科室的医生表
            OracleCommand command1 = new OracleCommand(sel, conn);
            //

            var rr = command1.ExecuteScalar();
            //int ret = Convert.ToInt32(command1.ExecuteScalar());


            if (command1.ExecuteScalar() != null)
            {
                OracleDataReader reader = command1.ExecuteReader();
                if (reader.Read())
                {
                    Session.Remove("id");
                    Session["id"] = id;


                }
                reader.Close();
                return "1";

            }
            else
            {
                return "0";
            }

            //if (reader.Read())
            //    {
            //        re = reader["DOC_NAME"].ToString();
            //        doct.doc_name = re;
            //        doct.dept_id = reader["DEP_ID"].ToString();

            //    }
            //reader.Close();
            //return ret;



        }
        #endregion


        #region 选择科室（yuyue）  跳出方法
        public ActionResult Dep()
        {
            //var doctors = new List<Doctor>{

            //    new Doctor{ doc_name = "www" },
            //     new Doctor{ doc_name = "ww33w" },
            //      new Doctor{ doc_name = "w3ww" },
            //};
            var id = Session["id"];
            //Session.Remove("id");  暂时不清除科室号

            //Doctor doctor = new Doctor();
            //string doc_name="";
            OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);//进行连接
            conn.Open();//打开指定的连接         
            string sel = "select ID,DOC_NAME,DEP_ID from DOCTOR_STATUS where DEP_ID ='" + id + "'";
            //得到医生信息
            OracleDataAdapter adapter = new OracleDataAdapter(sel, conn);
            DataSet doctor = new DataSet();
            adapter.Fill(doctor, "Doctor");





            OracleCommand command1 = new OracleCommand(sel, conn);
            OracleDataReader reader = command1.ExecuteReader();

            List<Doctor> d1 = new List<Doctor>();

            while (reader.Read())
            {
                Doctor d0 = new Doctor();

                d0.id = reader["ID"].ToString();
                d0.doc_name = reader["DOC_NAME"].ToString();
                d0.dept_id = reader["DEP_ID"].ToString();

                d1.Add(d0);

            }
            //实体化医生类




            //if (reader.HasRows)
            //{
            //    do
            //    {
            //        reader.Read();  
            //        //re = reader["DOC_NAME"].ToString();
            //        //doctor.doc_name = re;
            //        //doctor.dept_id = reader["DEP_ID"].ToString();
            //        //doctor.id = reader["ID"].ToString();

            //        for (var i = 0; i < reader.FieldCount; i++)
            //        {
            //            doctors[i].id = reader.GetString(0);

            //            //doctors[i].doc_name = reader.GetString(i);

            //            //doctors[i].dept_id = reader.GetString(i);

            //        }


            //    }
            //    while (reader.NextResult());
            //}
            //reader.Close();
            //ViewData["Doctor"] = doctor;

            return View(d1);
        }
        #endregion
    }
}