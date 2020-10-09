$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称的长度为1~6个字符'
            }
        }
    });
    initUserInfo()
        // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    };
    // 重置按钮
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    });
    // 用户信息修改
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改用户信息成功');
                window.parent.getUserInfo()
            }
        })

    })
})