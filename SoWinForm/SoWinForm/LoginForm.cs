using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Unicode;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;

namespace SoWinForm
{
    public partial class LoginForm : AntdUI.Window
    {
        public LoginForm()
        {
            InitializeComponent();
        }

        private void LoginForm_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            var data = new
            {
                username = input1.Text,
                password = input2.Text
            };
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.All)
            });
            Console.WriteLine(json);
            string ss = HttpHelper.HttpPost("http://127.0.0.1:8888/user/login", json);
            MessageBox.Show(ss);
        }

        private void button2_Click(object sender, EventArgs e)
        {
            string ss = HttpHelper.HttpGet("http://127.0.0.1:8888/user/findAllUser");
            MessageBox.Show(ss);
            var json = JsonSerializer.Serialize(ss, new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = true,
                ReferenceHandler = ReferenceHandler.IgnoreCycles
            });
            MessageBox.Show(json);
        }
    }
}
