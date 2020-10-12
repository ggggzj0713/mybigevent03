$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var str = template('tpl-table', res);
                $('tbody').html(str)
            }
        })


    }

    var indexAdd = null;
    $('#btnAdd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: "添加文章分类",
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    });

    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg('新增分类成功');
                layer.close(indexAdd)
            }
        })
    });

    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        var Id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val("form-edit", res.data);
            }
        })
    })

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(1);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('更新数据成功');
                layer.close(indexEdit);
                initArtCateList();

            }
        })
    })

    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })


})