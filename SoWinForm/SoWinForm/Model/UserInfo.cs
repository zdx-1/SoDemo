using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoWinForm.Model
{
    public class UserInfo
    {
        public class DataItem
        {
            /// <summary>
            /// 
            /// </summary>
            public int id { get; set; }
            /// <summary>
            /// 
            /// </summary>
            public string username { get; set; }
            /// <summary>
            /// 
            /// </summary>
            public string password { get; set; }
            /// <summary>
            /// 管理员
            /// </summary>
            public string role { get; set; }
        }

        public class Root
        {
            /// <summary>
            /// 查找成功
            /// </summary>
            public string msg { get; set; }
            /// <summary>
            /// 
            /// </summary>
            public int code { get; set; }
            /// <summary>
            /// 
            /// </summary>
            public List<DataItem> data { get; set; }
        }

    }
}
