(function(w,undefined){
    w.Pagination = function(config){
        this.bindDOM = config.el;
        this.url = config.url;
        this.limit = config.limit || 10;
        this.limitKey = config.limitKey || 'limit';
        this.page = config.page || 1;
        this.pageKey = config.pageKey || 'page';
        this.lastPage = 0;
        this.lastPageKey = config.lastPageKey || 'lastPage';
        this.data = config.data || {};
        this.before = config.before || '';
        this.callback = config.callback || '';
        
        //this.Ajax();
        this.bindEvent();
    }
    Pagination.prototype.update = function(data){//ajax时添加额外的参数
        for(key in data){
            this.data[key] = data[key];
        }
        this.Ajax();
    }
    Pagination.prototype.Ajax = function(){
        this.data[this.pageKey] = this.page;
        this.data[this.limitKey] = this.limit;
        if(typeof(this.before) === 'function'){
            this.before();
        }
        $.ajax({
            url: this.url,
            type: 'get',
            context: this,
            data: this.data,
            success: function(d){
                this.lastPage = parseInt(d[this.lastPageKey],10);
                if(d[this.pageKey]){//如果后端有传当前的页码，以后端传的为准
                    this.page = parseInt(d[this.pageKey],10);
                }
                this.draw();
                this.callback(d);
            }
        });
    }
    Pagination.prototype.draw = function(){
        var html = '<ul class="pagination">',
            page = this.page;
        html += this.drawPrevious();
        html += this.pageBefore();
        html += '<li class="active"><a href="javascript:;">'+ this.page +'</a></li>';
        html += this.pageAfter();
        html += this.drawNext();
        html += '</ul>';
        this.bindDOM.innerHTML = html;
        setTimeout(function(){
            $('#pagination_lastPage')[0].title = '第 '+ page + ' 页';
        },20);
    }
    Pagination.prototype.drawPrevious = function(){
        var html = '<li><a href="javascript:;"><span aria-hidden="true">&laquo;</span></a></li>';
        if(this.page == 1){
            html = html.replace(/<li>/,'<li class="disabled">');
        }
        return html;
    }
    Pagination.prototype.drawNext = function(){
        var html = '<li id="pagination_lastPage"><a href="javascript:;"><span aria-hidden="true">&raquo;</span></a></li>';
        console.log(this.page,this.lastPage)
        if(this.page >= this.lastPage){
            html = html.replace(/<li id="pagination_lastPage">/,'<li id="pagination_lastPage" class="disabled">');
        }
        return html;
    }
    Pagination.prototype.pageBefore = function(){
        var html = '';
        if(this.page > 3){
        	html += '<li class="disabled"><a href="javascript:;">…</a></li>';
        }
        for(var i = 2; i > 0; i--){
            if(this.page - i > 0){
                html += '<li><a href="javascript:;">'+ (this.page - i) +'</a></li>';
            }
        }
        return html;
    }
    Pagination.prototype.pageAfter = function(){
        var html = '';
        for(var i = 1; 3 > i; i++){
            if(this.page + i <= this.lastPage){
                html += '<li><a href="javascript:;">'+ (this.page + i) +'</a></li>';
            }
        }
        if(this.lastPage - this.page >= 3){
        	html += '<li class="disabled"><a href="javascript:;">…</a></li>';
        }
        return html;
    }
    Pagination.prototype.bindEvent = function(){
        var _this = this;
        this.bindDOM.addEventListener('click',function(e){
            var oLi = e.target;
            while(oLi.tagName !== 'LI'){
                if(oLi === _this.bindDOM) return false;//以防意外
                oLi = oLi.parentElement;
            }
            if(oLi.className !== 'disabled' && oLi.className !== 'active'){
                var actionMap = {
                    '«': function(){
                        return 1;
                    },
                    '»': function(){
                        return _this.lastPage;
                    },
                    'default': function(type){
                        return parseInt(type,10);
                    }
                }
                var page = (actionMap[oLi.innerText] || actionMap['default'])(oLi.innerText);
                _this.page = page;
                _this.Ajax();
            }
            
        })
    }
})(window);