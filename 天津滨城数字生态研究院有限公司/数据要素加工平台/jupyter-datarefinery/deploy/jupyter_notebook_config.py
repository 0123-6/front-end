c.NotebookApp.allow_origin = '*'
c.NotebookApp.answer_yes = False

c.NotebookApp.notebook_dir = '/root/notebooks'
c.NotebookApp.open_browser = False
c.NotebookApp.disable_check_xsrf = True

c.NotebookApp.allow_remote_access = True
c.NotebookApp.allow_root=True

#c.NotebookApp.password_required = True
#c.NotebookApp.password = "argon2:$argon2id$v=19$m=10240,t=10,p=8$u1DugBO/BQxiChiJC1psqw$uMLHGhMCX3RifmBIDMLlEw"

# boya
#c.NotebookApp.password = "argon2:$argon2id$v=19$m=10240,t=10,p=8$RYrI42SRzhE7Gr1NXTyHoQ$6n6sqBa8UsDwk5eHmJd2kP18oYAna9aDQEK/bb5ykro"

#  fuzademima
c.NotebookApp.password = "argon2:$argon2id$v=19$m=10240,t=10,p=8$616pNtitVlURlIdzzat4pw$WNGWCdtsVX56GS89PdaOhmr8AYTMamg7EAkblqdJhi4"

c.NotebookApp.token = ""

c.NotebookApp.ip = '0.0.0.0'
c.NotebookApp.port = 8080
c.NotebookApp.tornado_settings = {
'headers':  {
        'Content-Security-Policy': "frame-ancestors 'self'   * "
        }
}

# c.NotebookApp.token = '<ge+nerated>'

c.Session.username = 'jupyter'

c.MultiKernelManager.default_kernel_name = 'python3'

#c.MultiKernelManager.default_kernel_name = 'python3'


c.Session.item_threshold = 256
c.KernelManage.autorestart = False
c.KernelRestarter.restart_limit = 0

c.NotebookApp.iopub_data_rate_limit=100000000000.0
c.NotebookApp.rate_limit_window=300.0
