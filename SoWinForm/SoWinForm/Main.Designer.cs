namespace SoWinForm
{
    partial class Main
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
            table1 = new AntdUI.Table();
            SuspendLayout();
            // 
            // windowBar1
            // 
            windowBar1.Dock = DockStyle.Top;
            windowBar1.Location = new Point(0, 0);
            windowBar1.Name = "windowBar1";
            windowBar1.Size = new Size(800, 34);
            windowBar1.TabIndex = 0;
            windowBar1.Text = "windowBar1";
            // 
            // table1
            // 
            table1.Location = new Point(124, 118);
            table1.Name = "table1";
            table1.Size = new Size(372, 165);
            table1.TabIndex = 1;
            table1.Text = "table1";
            // 
            // Main
            // 
            AutoScaleDimensions = new SizeF(11F, 24F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(table1);
            Controls.Add(windowBar1);
            Margin = new Padding(4);
            Name = "Main";
            Text = "Main";
            Load += Main_Load;
            ResumeLayout(false);
        }

        #endregion

        private AntdUI.WindowBar windowBar1;
        private AntdUI.Table table1;
    }
}