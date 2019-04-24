var time = require('../../utils/util.js');//工具类
//获取应用实例
const app = getApp()

Page({
  data: {
    banana: '',
    userInfo: {},
    img_list: [],
    background1: "/images/doctor3.jpg",
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 转换背景图片格式
    var that = this;
    let base641 = wx.getFileSystemManager().readFileSync(that.data.background1, 'base64');
    that.setData({
      background1: 'data:image/jpg;base64,' + base641,
      id: options.id,
      userInfo: app.globalData.userInfo
    });

    wx.request({
      url: 'http://tieqiao.zzzpsj.com/index.php?g=api&m=banana&a=detail',
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var jsonArr = res.data.banana.photo.split(",")
        that.setData({
          banana: res.data.banana,
          img_list: jsonArr
        })

        var format_time = "banana.create_time"; //时间戳

        //时间戳
        that.setData({
          [format_time]: time.js_date_time(that.data.banana.create_time)
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})