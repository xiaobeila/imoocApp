### Running the examples on iOS
`npm install -g react-native-cli`
`npm i`
`react-native run-ios`

### 运行react-native 工程时，出错：xcrun: error: unable to find utility "instruments", not a developer tool or in PATH
`解决方法：在 终端执行如下命令 sudo xcode-select -s /Applications/Xcode.app/Contents/Developer/`

### 【已解决】ReactNative iOS运行出错：No bundle URL present
Now open any example (the .xcodeproj file in each of the Examples subdirectories) and hit Run in Xcode.
```
在iOS 模拟器已运行的情况下，在项目根目录的命令行中执行：

npm install
react-native run-ios
```

# React-NatIve学习
[react-native文档](http://reactnative.cn/docs/0.50/tutorial.html#content)

### Props（属性）

```
<Text>Hello {this.props.name}!</Text>
<Greeting name='Rexxar' />
```

### State（状态）

```
// 每1000毫秒对showText状态做一次取反操作
setInterval(() => {
  this.setState(previousState => {
    return { showText: !previousState.showText };
  });
}, 1000);
```

### 组件

```
滚动视图
<ScrollView></ScrollView>

列表渲染
长列表数据
<FlatList />
如果要渲染的是一组需要分组的数据，也许还带有分组标签的，那么SectionList将是个不错的选择.
<SectionList {title: 'D', data: ['Devin']}/>


输入值
<TextInput />
<Text></Text>

图片
<Image source= />

按钮
<Button onPress={this.fetchData} title="提交" />

网络请求
fetch('http://rap.taobao.org/mockjs/29738/api/creations?accessToken=asd')
.then((response) => response.json())
.then((responseJson) => {
  console.log(responseJson);
})
.catch((error) => {
  console.error(error);
});
```

### 字体

```
Text:

属性
1. numberOfLines 文本显示的行数(行数限制)，添加后超过限制行数文本会在末尾默认以...的形式省略。
2. ellipsizeMode 设置文本缩略格式，配合numberOfLines使用，values：
tail：在末尾...省略（默认值）
clip：在末尾切割，直接切割字符无省略符
head：在前面...省略
middle：在中间...省略
3. onPress 点击事件
4. style 样式

样式
1. color 字体颜色
2. fontSize 字体大小
3. fontFamily 字体
4. fontStyle 字的样式  （normal：正常italic：斜体）
5. fontWeight 设置粗体（normal：正常bold：粗体100，200，300， 400， 500， 600， 700， 800， 900）
6.	lineHeight 行高
7.	textAlign 文字对其方式（auto：自动对齐left：左对齐right：右对齐 center：居中对齐）
8: textDecorationLine 下划线和删除线样式（none：无线underline：下划线line-through：删除线 underline line-through：下划线和删除线）
9. textShadowColor	阴影效果颜色
10. textShadowOffset  设置阴影效果
11. textShadowRadius	 阴影效果圆角	
12. includeFontPadding	文本是否包含顶部和底部额外空白
13. selectionColor	当文本被选中时突出显示的颜色
14. textAlignVertical	 文本垂直对齐方式	
15. textBreakStrategy	 英文文本的分段策略	
16. letterSpacing	 字符间距	
17. textDecorationColor	 文本装饰线条的颜色	
18. textDecorationStyle	 文本装饰线条的风格	
19. writingDirection	 文本方向


```
