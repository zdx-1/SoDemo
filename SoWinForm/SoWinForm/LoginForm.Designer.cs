namespace SoWinForm
{
    partial class LoginForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            windowBar1 = new AntdUI.WindowBar();
            input1 = new AntdUI.Input();
            input2 = new AntdUI.Input();
            label1 = new AntdUI.Label();
            label2 = new AntdUI.Label();
            button1 = new AntdUI.Button();
            button2 = new AntdUI.Button();
            SuspendLayout();
            // 
            // windowBar1
            // 
            windowBar1.Dock = DockStyle.Top;
            windowBar1.Location = new Point(0, 0);
            windowBar1.Name = "windowBar1";
            windowBar1.Size = new Size(783, 34);
            windowBar1.TabIndex = 0;
            windowBar1.Text = "windowBar1";
            // 
            // input1
            // 
            input1.Location = new Point(234, 142);
            input1.Name = "input1";
            input1.Size = new Size(260, 34);
            input1.TabIndex = 1;
            // 
            // input2
            // 
            input2.Location = new Point(234, 199);
            input2.Name = "input2";
            input2.Size = new Size(260, 34);
            input2.TabIndex = 2;
            // 
            // label1
            // 
            label1.Location = new Point(104, 142);
            label1.Name = "label1";
            label1.Size = new Size(112, 34);
            label1.TabIndex = 3;
            label1.Text = "用户名";
            // 
            // label2
            // 
            label2.Location = new Point(104, 199);
            label2.Name = "label2";
            label2.Size = new Size(112, 34);
            label2.TabIndex = 4;
            label2.Text = "密码";
            // 
            // button1
            // 
            button1.Location = new Point(144, 302);
            button1.Name = "button1";
            button1.Size = new Size(112, 34);
            button1.TabIndex = 5;
            button1.Text = "登录";
            button1.Click += button1_Click;
            // 
            // button2
            // 
            button2.Location = new Point(382, 302);
            button2.Name = "button2";
            button2.Size = new Size(112, 34);
            button2.TabIndex = 6;
            button2.Text = "button2";
            button2.Click += button2_Click;
            // 
            // LoginForm
            // 
            AutoScaleDimensions = new SizeF(11F, 24F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(783, 488);
            Controls.Add(button2);
            Controls.Add(button1);
            Controls.Add(label2);
            Controls.Add(label1);
            Controls.Add(input2);
            Controls.Add(input1);
            Controls.Add(windowBar1);
            Margin = new Padding(4);
            Name = "LoginForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "LoginForm";
            Load += LoginForm_Load;
            ResumeLayout(false);
        }

        #endregion

        private AntdUI.WindowBar windowBar1;
        private AntdUI.Input input1;
        private AntdUI.Input input2;
        private AntdUI.Label label1;
        private AntdUI.Label label2;
        private AntdUI.Button button1;
        private AntdUI.Button button2;
    }
}