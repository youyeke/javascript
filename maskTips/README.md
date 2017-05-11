## Demo

> https://youyeke.github.io/javascript/maskTips/

## 使用方法

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
