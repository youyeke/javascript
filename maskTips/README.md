# Demo

> https://youyeke.github.io/javascript/maskTips/

bootstrap 版

> https://youyeke.github.io/javascript/maskTips/index-bootstrap.html

# 使用方法

## bootstrap 版

引入 bootstrap-maskTips.js 和 css/bootstrap-maskTips.css

### 弹出提示

```javascript
//简洁调用
maskLayer.tips('提示的内容');
//完整参数调用,message 必须，其它可选
maskLayer.tips({
	title : '提示框标题',
	message : '提示框内容',
	type : 'primary', // 提示框的主题颜色，支持 Bootstrap 的全部主题颜色。
	confirm : '确定' // ‘确定’ 按钮的文字
});
```

PS. 无论是简洁调用还是全参数调用，第二个参数可传入一个回调函数。该回调函数将会在点击 ‘确定’ 后调用。

### 弹出确认提示

```javascript
//简洁调用
maskLayer.warn('提示的内容');
//完整参数调用,message 必须，其它可选
maskLayer.warn({
	title : '提示框标题',
	message : '提示框内容',
	type : 'danger', // 提示框的主题颜色，支持 Bootstrap 的全部主题颜色。
	cancel : '取消', // ‘取消’ 按钮的文字
	confirm : '确定' // ‘确定’ 按钮的文字
});
```

PS. 无论是简洁调用还是全参数调用，第二个参数可传入一个回调函数。该回调函数将会在点击 ‘确定’ 后调用。

### 广播提示

广播提示会出现在屏幕正上方，不拥堵用户操作。默认 1.5 秒后自动消失。

```javascript
//简洁调用
maskLayer.news('提示的内容');
//完整参数调用,message 必须，其它可选
maskLayer.news({
	title : '提示框标题',
	message : '提示框内容',
	type : 'info', // 广播提示的主题颜色，支持 Bootstrap 的全部主题颜色。
	time : 3000 // 多少毫秒后自动消失
});
```

PS. 无论是简洁调用还是全参数调用，第二个参数可传入一个回调函数。该回调函数将会在广播提示消失后调用。



## 无依赖版

    在引入 js 后，会暴露一个全局对象：maskLayer
### maskLayer.tips

该方法用于弹出一个带有确认按钮的提示，点击‘确定’后关闭
    
```javascript
maskLayer.tips("提示的内容");
```
    
你也可以使用第二个参数来改变提示的主题颜色
```javascript
maskLayer.tips("警告型提示","failed");
```
### maskLayer.warn

该方法用于弹出一个带有‘确定’和‘取消’两个按钮的警告提示

点击‘确定’才会执行回调函数，点‘取消’则会关闭提示

该方法接受两个参数，第一个参数是提示的内容，第二个参数是回调函数

    maskLayer.warn(String,callback)

Demo：

```javascript
maskLayer.warn("警告框，按确认才能执行回调函数",function(){
  maskLayer.tips("这是回调函数");
});
```

### maskLayer.news

该方法用于弹出一个等待提示，在一定时间后会自动关闭提示

该方法接受四个参数，第一个参数是提示的内容，第二个参数是主题颜色

第三个参数是等待时间(毫秒)，第四个是回调函数

    maskLayer.news(String,className,time,callback)


Demo：

```javascript
maskLayer.news("等待2秒","failed",2000,function(){
  maskLayer.tips("2秒后才显示");
});
```
### maskLayer.wait

该方法用于弹出一个用户无法关闭自行的提示框

Demo：

```javascript
maskLayer.wait("只能一直等待下去");
```
### maskLayer.clearMask

该方法用于关闭任何提示框，包括由 maskLayer.wait 产生的

Demo：

```javascript
maskLayer.clearMask();
```
