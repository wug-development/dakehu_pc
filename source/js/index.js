+(() => {
    const bookbox = $('.bookbox')
    bookbox.find('.menu div').on('click', function () {
        $(this).addClass('cur').siblings('div').removeClass('cur')
        if($(this).hasClass('go')){
            bookbox.find('.go-return-box').show().find('.daodadate').hide()
            bookbox.find('.go-return-box').next().hide()
        }else if($(this).hasClass('return')){
            bookbox.find('.go-return-box').show().find('.daodadate').show()
            bookbox.find('.go-return-box').next().hide()
        }else{
            bookbox.find('.go-return-box').hide().next().show()
        }
    })
    bookbox.find('.tab div').on('click', function () {
        if(!$(this).hasClass('cur')){
            $(this).addClass('cur').siblings('div').removeClass('cur')
        }
    })

    getGNCity()
})()

function getGNCity(){
    let _url = 'city/getcity';
    app.util.ajax({
        url: _url,
        success: function(res) {
            console.log(res)
            let _html = '';
            for (let i=0; i<res.data.length; i++) {
                _html += '<option value=' + res.data[i].id + '>' + res.data[i].airportname + '</option>';
            }
            $('#ddl_startCity').html(_html);
        },
        complete: function(res, ss){
        }
    })
}

(()=>{
    layui.use(['form', 'layedit', 'laydate'], function(){
        var form = layui.form
        ,layer = layui.layer
        ,layedit = layui.layedit
        ,laydate = layui.laydate;
        
        //日期
        laydate.render({
            elem: '#startDate',
            min: ''
        });
        laydate.render({
            elem: '#endDate',
            min: ''
        });
        
        //创建一个编辑器
        var editIndex = layedit.build('LAY_demo_editor');
       
        //自定义验证规则
        form.verify({
            title: function(value){
                if(value.length < 5){
                    return '标题至少得5个字符啊';
                }
            }
            ,pass: [
                /^[\S]{6,12}$/
                ,'密码必须6到12位，且不能出现空格'
            ]
            ,content: function(value){
                layedit.sync(editIndex);
            }
        });
        
        //监听指定开关
        form.on('switch(switchTest)', function(data){
            layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
                offset: '6px'
            });
            layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
        });
        
        //监听提交
        form.on('submit(demo1)', function(data){
            layer.alert(JSON.stringify(data.field), {
                title: '最终的提交信息'
            })
            return false;
        });
       
        //表单初始赋值
        form.val('example', {
            "username": "贤心" // "name": "value"
            ,"password": "123456"
            ,"interest": 1
            ,"like[write]": true //复选框选中状态
            ,"close": true //开关状态
            ,"sex": "女"
            ,"desc": "我爱 layui"
        })
        
    });
})()