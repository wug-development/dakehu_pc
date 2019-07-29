(function(){
    $('#btn_login').on('click', () => {
        let uname = $('#txt_username').val().trim()
        let upass = $('#txt_password').val().trim()
        let _url = 'company/login'
        app.util.ajax({
            url: _url,
            data: {
                uname,
                upass
            },
            success: function(res) {
                if (res && res.status != 0) {
                    app.util.setCookie('airkx_account', JSON.stringify(res.data[0]))
                    window.location.href = 'index.html'
                } else {
                    alert(res.msg)
                }
            }
        })
    })
}())