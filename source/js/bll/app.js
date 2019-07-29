;(function(){
    $.ajaxSetup({
        beforeSend : function(){
            this.url="http://localhost:63844/api/"+this.url;
        }
    })
}())
const app = {
    util: {
        ajax : options => {	
			if(typeof jQuery === "function" && $ === jQuery || typeof Zepto === "function" && $ === Zepto){
				let _obj = {
					type: options.type || 'get',
					url: options.url,
					async: options.async || true,
					dataType: options.dataType || 'json',
                    data: options.data || {},
                    converters: { "* text": String},
					success: res => {
						if(typeof options.success === "function"){
							options.success(res);
						}
					},error: (XMLHttpRequest, textStatus, errorThrown) => {
						console.log("%c error : " + textStatus,"color:#f00");
						console.log("%c "+options.url,"color:#f00");
					},complete: () => {
						if(typeof options.complete === "function"){
							options.complete();
						}
					}					
				};
				$.ajax(_obj);
			}
		},
		//取cookie
		getCookie:function(objName){//获取指定名称的cookie的值
		    var arrStr = document.cookie.split("; ");
		    for(var i = 0;i < arrStr.length;i ++){
				var temp = arrStr[i].split("=");
				if(temp[0] == objName) {
					return unescape(temp[1]);
				}					 
			}
			return undefined;
		},
		//设置cookie
		setCookie:function (name,value){
	        var Days = 7;
	        var exp  = new Date();
	        exp.setTime(exp.getTime() + Days*24*60*60*1000);
	        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+';';  	        
	    } ,
	    //删除cookie
	    delCookie:function(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
		   var date = new Date();
		   date.setTime(date.getTime() - 10000);
		   document.cookie = name + "=0;expires=" + date.toGMTString();
		}
    }
}

;(()=>{
	let _accountdata = app.util.getCookie('airkx_account')
	if (_accountdata) {
		let _obj = JSON.parse(_accountdata)
		$('#lab_name').text(_obj.uname);
	}
})()