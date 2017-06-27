(function () {
	var d = document,
	w = window,
	p = parseInt,
	dd = d.documentElement,
	db = d.body,
	dc = d.compatMode == 'CSS1Compat',
	dx = dc ? dd: db,
	ec = encodeURIComponent;

	
	w.CHAT = {
		msgObj:d.getElementById("message"),
		screenheight:w.innerHeight ? w.innerHeight : dx.clientHeight,
		username:null,
		userid:null,
		socket:null,
		//让浏览器滚动条保持在最低部
		scrollToBottom:function(){
			w.scrollTo(0, this.msgObj.clientHeight);
		},
		//退出，本例只是一个简单的刷新
		logout:function(){
			//this.socket.disconnect();
			location.reload();
		},
		dddfs:function dddfs(id,counent){
			var counents = $("#"+counent).val();
			var obj = {
				userid: this.userid,
				username: this.username,
				content: counents,
				touserid:id
			};
			this.socket.emit('message', obj);
			var doc = d.getElementById("docddd");
			var contentDiv = '<div>' + obj.content + '</div>';
			var usernameDiv = '<span>' + obj.username + '</span>';
			var section = d.createElement('section');
			section.className = 'user';
			section.innerHTML = contentDiv + usernameDiv;
			d.getElementById("messageddd").appendChild(section);
			d.getElementById("messageddd").scrollToBottom();
		},
		hui:function hui(obj){

			var ids = obj.id;
			layer.open({
				type: 1, //page层
				area: ['500px', '300px'],
				title: '你好，layer。',
				shade: 0.6, //遮罩透明度
				moveType: 1, //拖拽风格，0是默认，1是传统拖动
				shift: 1, //0-6的动画形式，-1不开启
				content: " <div id=\"docddd\"> <div id=\"chatddd\"> <div id=\"messageddd\" class=\"message\"> <div id=\"onlinecountddd\" style=\"background:#EFEFF4; font-size:12px; margin-top:10px; margin-left:10px; color:#666;\"> </div>"+
				"</div><div> <div class=\"input\">"+
				"<input type=\"text\" maxlength=\"140\" placeholder=\"请输入聊天内容，按Ctrl提交\" id=\"contentddd\" name=\"content\">"+
				"</div> <div class=\"action\"> <button type=\"button\" id=\"mjr_send\" onclick=\"CHAT.dddfs('"+ids+"','contentddd');\">提交</button> </div> </div></div> </div>"
			});
		},
		//提交聊天消息内容
		submit:function(){
			var content = d.getElementById("content").value;
			if(content != ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				this.socket.emit('allmessage', obj);
				d.getElementById("content").value = '';
			}
			return false;
		},
		genUid:function(){
			return new Date().getTime()+""+Math.floor(Math.random()*899+100);
		},
		//更新系统消息，本例中在用户加入、退出的时候调用
		updateSysMsg:function(o, action){
			//当前在线用户列表
			var onlineUsers = o.onlineUsers;
			//当前在线人数
			var onlineCount = o.onlineCount;
			//新加入用户的信息
			var user = o.user;
				
			//更新在线人数
			var userhtml = '';
			var separator = '';
			for(key in onlineUsers) {
		        if(onlineUsers.hasOwnProperty(key)){
					userhtml += "<a href='#' onclick='CHAT.hui(this);' id='"+key+"'>"+separator+onlineUsers[key]+"</a>";
					separator = '、';
				}
		    }
			d.getElementById("onlinecount").innerHTML = '当前共有 '+onlineCount+' 人在线，在线列表：'+userhtml;
			
			//添加系统消息
			var html = '';
			html += '<div class="msg-system">';
			html += user.username;
			html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
			html += '</div>';
			var section = d.createElement('section');
			section.className = 'system J-mjrlinkWrap J-cutMsg';
			section.innerHTML = html;
			this.msgObj.appendChild(section);	
			this.scrollToBottom();
		},
		//第一个界面用户提交用户名
		usernameSubmit:function(){
			var username = d.getElementById("username").value;
			if(username != ""){
				d.getElementById("username").value = '';
				d.getElementById("loginbox").style.display = 'none';
				d.getElementById("chatbox").style.display = 'block';
				this.init(username);
			}
			return false;
		},
		init:function(username){
			/*
			客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
			实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
			*/
			this.userid = this.genUid();
			this.username = username;
			
			d.getElementById("showusername").innerHTML = this.username;
			//this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + "px";
			this.scrollToBottom();
			
			//连接websocket后端服务器
			this.socket = io.connect('ws://192.168.200.2:3000');
			
			//告诉服务器端有用户登录
			this.socket.emit('login', {userid:this.userid, username:this.username});
			
			//监听新用户登录
			this.socket.on('login', function(o){
				CHAT.updateSysMsg(o, 'login');	
			});
			
			//监听用户退出
			this.socket.on('logout', function(o){
				CHAT.updateSysMsg(o, 'logout');
			});
			//监听单用户消息
			this.socket.on('dddmessage',function(obj){
				var doc = d.getElementById("docddd");
				if(doc) {
					var isme = (obj.userid == CHAT.userid) ? true : false;
					var contentDiv = '<div>' + obj.content + '</div>';
					var usernameDiv = '<span>' + obj.username + '</span>';
					var section = d.createElement('section');
					if (isme) {
						section.className = 'user';
						section.innerHTML = contentDiv + usernameDiv;
					} else {
						section.className = 'service';
						section.innerHTML = usernameDiv + contentDiv;
					}
					d.getElementById("messageddd").appendChild(section);
					d.getElementById("messageddd").scrollToBottom();
				}else{
					layer.msg( obj.username+'对你说：'+obj.content,{
							icon:1,
							time:0,
							closeBtn:1,
							shift:6,
						btn:['查看'],
							btn1:function(index, layero){
								var obj1 = {
										id:obj.userid
								}
								CHAT.hui(obj1);
							}
					}, function(){

					});
				}
			})
			//监听消息多用户发送
			this.socket.on('message', function(obj){
				var isme = (obj.userid == CHAT.userid) ? true : false;
				var contentDiv = '<div>'+obj.content+'</div>';
				var usernameDiv = '<span>'+obj.username+'</span>';
				
				var section = d.createElement('section');
				if(isme){
					section.className = 'user';
					section.innerHTML = contentDiv + usernameDiv;
				} else {
					section.className = 'service';
					section.innerHTML = usernameDiv + contentDiv;
				}
				CHAT.msgObj.appendChild(section);
				CHAT.scrollToBottom();
			});

		}
	};
	//通过“回车”提交用户名
	d.getElementById("username").onkeydown = function(e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.usernameSubmit();
		}
	};
	//通过“回车”提交信息
	d.getElementById("content").onkeydown = function(e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.submit();
		}
	};

})();