using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using WinFormium;

namespace SoNanUI;
internal class MyWindow : Formium
{
    public MyWindow()
    {

        Loaded += MyWindow_Loaded;


        PageLoadEnd += MyWindow_PageLoadEnd;
    }

    public MyWindow(ChromiumEnvironment env) // 依赖注入测试; Dependency Injection Testing;
    {

        //默认测试，加载普通网页
        //Default test, load web page
        Url = "http://192.168.2.100:3100/";

        //测试加载本地资源
        //Test loading local resources
        //Url = "http://static.app.local/";

        //测试嵌入资源
        //Test loading embedded resources
        //Url = "http://embedded.app.local/";

        //错误地址测试，指定了错误页面的地址，如果页面加载失败，将会自动显示WinFormium内置的错误页面。
        //Error address test specifies the address of the error page. If the page fails to load, WinFormium's built-in error page will be automatically displayed.
        //Url = "http://static1.app.local/";

        //注意，默认没有指定任何Url，新版WinFormium将会自动加载一个欢迎页面。
        //If no URL is specified, WinFormium will automatically load a welcome page.


        //这个事件对应WinForm的Load事件，对应NanUI的OnReady抽象方法
        //OnReady of old version NanUI
        Loaded += MyWindow_Loaded;


        PageLoadEnd += MyWindow_PageLoadEnd;


    }
    private void MyWindow_Loaded(object? sender, BrowserEventArgs e) { }
    private void MyWindow_PageLoadEnd(object? sender, PageLoadEndEventArgs e) { }
}