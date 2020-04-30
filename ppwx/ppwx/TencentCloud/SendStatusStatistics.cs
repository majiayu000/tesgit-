using System;
using TencentCloud.Common;
using TencentCloud.Common.Profile;
using TencentCloud.Sms.V20190711;
using TencentCloud.Sms.V20190711.Models;


namespace ppwx.TencentCloud
{



    class SendStatusStatistics
    {
        static void Main(string[] args)
        {
            try
            {
                /* 必要步骤：
                 * 实例化一个认证对象，入参需要传入腾讯云账户密钥对 secretId 和 secretKey
                 * 本示例采用从环境变量读取的方式，需要预先在环境变量中设置这两个值
                 * 您也可以直接在代码中写入密钥对，但需谨防泄露，不要将代码复制、上传或者分享给他人
                 * CAM 密匙查询：https://console.cloud.tencent.com/cam/capi*/
                Credential cred = new Credential
                {
                    SecretId = "xxx",
                    SecretKey = "xxx"
                };
                /*
                Credential cred = new Credential {
                    SecretId = Environment.GetEnvironmentVariable("TENCENTCLOUD_SECRET_ID"),
                    SecretKey = Environment.GetEnvironmentVariable("TENCENTCLOUD_SECRET_KEY")
                };*/

                /* 非必要步骤:
                 * 实例化一个客户端配置对象，可以指定超时时间等配置 */
                ClientProfile clientProfile = new ClientProfile();
                /* SDK 默认用 TC3-HMAC-SHA256 进行签名
                 * 非必要请不要修改该字段 */
                clientProfile.SignMethod = ClientProfile.SIGN_TC3SHA256;
                /* 非必要步骤
                 * 实例化一个客户端配置对象，可以指定超时时间等配置 */
                HttpProfile httpProfile = new HttpProfile();
                /* SDK 默认使用 POST 方法
                 * 如需使用 GET 方法，可以在此处设置，但 GET 方法无法处理较大的请求 */
                httpProfile.ReqMethod = "POST";
                /* SDK 有默认的超时时间，非必要请不要进行调整
                 * 如有需要请在代码中查阅以获取最新的默认值 */
                httpProfile.Timeout = 10; // 请求连接超时时间，单位为秒(默认60秒)
                /* SDK 会自动指定域名，通常无需指定域名，但访问金融区的服务时必须手动指定域名
               * 例如 SMS 的上海金融区域名为 sms.ap-shanghai-fsi.tencentcloudapi.com */
                httpProfile.Endpoint = "sms.tencentcloudapi.com";
                // 代理服务器，当您的环境下有代理服务器时设定
                httpProfile.WebProxy = Environment.GetEnvironmentVariable("HTTPS_PROXY");

                clientProfile.HttpProfile = httpProfile;
                /* 实例化 SMS 的 client 对象
                 * 第二个参数是地域信息，可以直接填写字符串 ap-guangzhou，或者引用预设的常量 */
                SmsClient client = new SmsClient(cred, "ap-guangzhou", clientProfile);

                /* 实例化一个请求对象，根据调用的接口和实际情况，可以进一步设置请求参数
                  * 您可以直接查询 SDK 源码确定 SendSmsRequest 有哪些属性可以设置
                  * 属性可能是基本类型，也可能引用了另一个数据结构
                  * 推荐使用 IDE 进行开发，可以方便地跳转查阅各个接口和数据结构的文档说明 */
                SendStatusStatisticsRequest req = new SendStatusStatisticsRequest();

                /* 基本类型的设置:
                * SDK 采用的是指针风格指定参数，即使对于基本类型也需要用指针来对参数赋值
                * SDK 提供对基本类型的指针引用封装函数
                * 帮助链接：
                * 短信控制台：https://console.cloud.tencent.com/sms/smslist
                * sms helper：https://cloud.tencent.com/document/product/382/3773 */

                /* 短信应用 ID: 在 [短信控制台] 添加应用后生成的实际 SDKAppID，例如1400006666 */
                req.SmsSdkAppid = "1400009099";
                // 设置拉取最大条数，最多100条
                req.Limit = 5L;
                /* 偏移量，目前固定设置为0 */
                req.Offset = 0L;
                /* 开始时间，yyyymmddhh 需要拉取的起始时间，精确到小时 */
                req.StartDateTime = "2019071100";
                /* 结束时间，yyyymmddhh 需要拉取的截止时间，精确到小时
                 * 注：EndDataTime 必须大于 StartDateTime */
                req.EndDataTime = "2019071123";

                // 通过 client 对象调用 AddSmsTemplateRequest 方法发起请求，注意请求方法名与请求对象是对应的
                // 返回的 resp 是一个 AddSmsTemplateResponse 类的实例，与请求对象对应
                SendStatusStatisticsResponse resp = client.SendStatusStatisticsRequest(req);

                // 输出 JSON 格式的字符串回包
                Console.WriteLine(AbstractModel.ToJsonString(resp));
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
            }
            Console.Read();
        }
    }

}