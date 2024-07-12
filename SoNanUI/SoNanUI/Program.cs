using WinFormium;

namespace SoNanUI;
internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main(string[] args)
    {

        var builder = WinFormiumApp.CreateBuilder();

        var app = builder
            // ʹ��WinFormiumStartup������������Ӧ�ó�������������̳���WinFormiumStartup�࣬������ṩ��һЩ����������Ӧ�ó���
            // Use a subclass of WinFormiumStartup to start the application. This subclass must inherit from the WinFormiumStartup class, which provides some methods to configure the application.
            .UseWinFormiumApp<MyApp>()
            // �����ڲ������������汾Ĭ���ⲿUrl�򿪷�ʽ�ǵ���ϵͳĬ�����������Ҫ�ֶ������ڲ�����������ʹ���ڲ���������ⲿUrl��
            // Enable the internal browser. In this version, the default external URL opening method is to call the system default browser. You need to manually enable the internal browser before you can use the internal browser to open the external URL.
            .UseEmbeddedBrowser()
            // ��ʾ����ģʽ��������Ӧ����Ҫ����ģʽ����ô����ʹ��������������õ���ģʽ���°汾����ʹ��ActiveRunningInstance�����������Ѿ�����ʵ���������塣
            // Demonstrate singleton mode. If your application requires singleton mode, you can use this method to enable singleton mode. The new version can use the ActiveRunningInstance method to activate the main form of the running instance.
            .UseSingleApplicationInstanceMode(handler =>
            {
                var retval = MessageBox.Show($"�Ѿ���һ��ʵ����������:{handler.ProcessId}��\r\n�Ƿ���������壿", "����ģʽ������", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                if (retval == DialogResult.Yes)
                {
                    handler.ActiveRunningInstance();
                }
            })
            // ������ָ��culture�ַ�����ģ������Ի���������汾�Ķ����Ի����������ƣ�ֻ�ṩzh-CN��en-US�������Ի�������ӭ�ύPR�����Ӹ������Ի�����
            // Specify the culture string here to simulate the multilingual environment. The multilingual environment of this version is not perfect, and only provides two language environments: zh-CN and en-US. Welcome to submit PR to add more language environments.
            //.UseCulture("en-US")
            // �Ƿ����ÿ����߹��߲˵�������˵���������������Ҽ��˵����ҵ���
            // Whether to enable the developer tool menu, this menu can be found in the right-click menu of the main form.
            .UseDevToolsMenu()
            .Build();

        app.Run();

    }
}
