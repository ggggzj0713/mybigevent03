$(function() {
    // 时间过滤器
    template.defaults.imports.dateFormat = function(dtstr) {
            var dt = new Date(dtstr);
            var y = dt.getFullYear();
            var m = padzero(dt.getMonth() + 1);
            var d = padzero(dt.getDate());

            var hh = padzero(dt.getHours());
            var mm = padzero(dt.getMinutes());
            var ss = padzero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss

        }
        // 补0函数
    function padzero(n) {
        return n > 9 ? n : '0' + n
    }
    var form = layui.form;
    var layer = layui.layer;
    var laypage = layui.laypage;

    var q = {
            pagenum: 1,
            pagesize: 2,
            cate_id: '',
            state: ''
        }
        // 初始化文章列表
    initTable();

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                renderPage(res.total);
            }
        })
    }
    // 初始化分类
    initCate()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlstr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlstr);
                form.render();
            }

        })
    }

    // 筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        q.state = state;
        q.cate_id = cate_id;
        initTable();
    });

    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页加载位置
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum, //第几页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    // 删除功能
    $('tbody').on('click', '#btn-delete', function() {
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('文章删除成功')
                    if ($('#btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})