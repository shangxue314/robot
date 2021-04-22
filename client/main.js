const local = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key))
    }
}
let vm = new Vue({
    el: '#app',
    data: {
        photos: ['https://img0.baidu.com/it/u=3251940718,1404860427&fm=26&fmt=auto&gp=0.jpg','https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2303164920,692099505&fm=26&gp=0.jpg'],  // 头像
        msg: '',                                    // 输入框信息
        dialoglist: local.fetch('robot') || [],     // 保存聊天数组
        bodyHeight: 0                               // body高度
    },
    watch: {
        bodyHeight(newVal){
            console.log(newVal);
            window.scrollTo({
                top: newVal,
                behavior: 'smooth'      // 原生滚动条缓动
            })
        }
    },
    created(){
        // 请求拦截器
        axios.interceptors.request.use(config=>{
            document.title = '机器人输入中'
            return config
        })
        // 响应拦截器
        axios.interceptors.response.use(res=>{
            document.title = '聊天机器人'
            return res
        })
        // 设置超时时间
        axios.defaults.timeout = 5000
    },
    mounted(){
        this.bodyHeight = document.body.offsetHeight
        window.scrollTo({
            top: this.bodyHeight,
            behavior: 'smooth'      // 原生滚动条缓动
        })
    },
    methods: {
        sendMsg(){
            // 添加我的聊天
            if(this.msg == ''){
                alert('说点啥吧')
                return
            }
            this.dialoglist.push({
                photoIndex: 0,
                msg: this.msg
            })
            // 添加到localStorage
            local.save('robot',this.dialoglist)
            // dom更新后，更新bodyHeight的高度值
            this.$nextTick(()=>{
                this.bodyHeight = document.body.offsetHeight
            })
            // 生产接口地址为http://39.97.165.31:4000/robot
            axios.get('http://localhost:4000/robot',{
                params: {
                    key: 'free',
                    appid: 0,
                    msg: this.msg
                }
            }).then(res=>{
                // 添加机器人的聊天
                this.dialoglist.push({
                    photoIndex: 1,
                    msg: res.data.content
                })
                // 添加到localStorage
                local.save('robot',this.dialoglist)
                // dom更新后，更新bodyHeight的高度值
                this.$nextTick(()=>{
                    this.bodyHeight = document.body.offsetHeight
                })
            }).catch(err=>{
                if(err.message.includes('timeout')){
                    alert('网络不好，请求超时啦')
                }
                console.log(err.message);
            })
            // 清空输入框文字
            this.msg = ''
        },
        focusMsg(){
            // ios触发键盘滚动到底部
            window.scrollTo({
                top: this.bodyHeight,
                behavior: 'smooth'      // 原生滚动条缓动
            })
        }
    }
})
// 安卓触发键盘滚动到底部
window.addEventListener('resize',()=>{
    window.scrollTo({
        top: vm.bodyHeight,
        behavior: 'smooth'      // 原生滚动条缓动
    })
})
