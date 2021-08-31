(function($) {
    window.teaUpdate = {};
    // window.teaUpdate.settings_data_json_url = '//cdn.shopify.com/s/files/1/2786/4584/t/13/assets///%20settings_presets.json?39593';
    var $data = {};

    function BindEvent() {}

    function updateContentForIndex() {
        var t = [];
        $(top.document).find("[data-content-for-index]").children("li").each(function() {
            var e = $(this).attr("data-section-id");
            e && t.push(e)
        }), t.length > 0 && (top.window.jsContentForIndex = t)
    }

    function isObject(t) {
        return t === Object(t)
    }

    function isArray(t) {
        return Array.isArray(t)
    }

    function isFile(t) {
        return t instanceof File
    }

    function mapToJson(t, e, n) {
        var n = n || {};
        return 1 === t.length ? (e.indexOf("[]") > -1 ? e = [] : e.indexOf('["') > -1 && (e = e.replace('["', "").replace('"]', "").replace(new RegExp('","', "g"), "|").split("|")), n[t[0]] = e, n) : (n[t[0]] = n[t[0]] || {}, n[t[0]] = mapToJson(t.slice(1), e, n[t[0]]), n)
    }

    function jsonToMap(t, e, n) {
        return e = e || [], Object.keys(t).forEach(function(o) {
            var i = n ? n + "[" + o + "]" : o;
            !isObject(t[o]) || isArray(t[o]) || isFile(t[o]) ? isArray(t[o]) ? t[o].forEach(function(t) {
                var n = i + "[]";
                isObject(t) && !isFile(t) ? jsonToMap(t, e, n) : e.push({
                    name: n,
                    value: t
                })
            }) : e.push({
                name: i,
                value: t[o]
            }) : jsonToMap(t[o], e, i)
        }), e
    }

    function getCurrentFormSettings() {
        var t = $(top.document).find(".te-sidebar").serializeArray();
        t.push({
            name: "settings[content_for_index]",
            value: '["' + top.window.jsContentForIndex.join('","') + '"]'
        });
        for (var e = {}, n = 0; n < t.length; n++) {
            var o = t[n].name.replace("settings", "").split("][").join("|").replace("[", "").replace("]", "").split("|"),
                i = t[n].value;
            mapToJson(o, i, e)
        }
        return e
    }

    function MergerSectionsData(t) {
        var e = getCurrentFormSettings(),
            n = {
                sections: {},
                accessToken: e.CurrentSettings
            };
        return console.log(e), console.log(t), console.log($.extend({}, n, t)), $.extend({}, n, t)
    }

    function importData(t, e) {
        var n = {
                method: "PATCH",
                url: top.Shopify.routes.theme_editor_save(top.THEME_ID).html,
                data: t
            },
            o = $.extend({}, n, e);
        console.log(o), top.Shopify.ajax(o).done(function(t) {
            setTimeout(function() {
                top.window.location.reload()
            }, 3000);
        }).fail(function(t) {
            console.info("fail", t)
        })
    }
    top.window.jsContentForIndex || (top.window.jsContentForIndex = top.window.Shopify.contentForIndex), $(document).on("shopify:section:load", updateContentForIndex), $(document).on("shopify:section:reorder", updateContentForIndex);
    var $top = $(top.document),
        $action_list = $top.find(".ui-action-list").first();
    $action_list.find(".theme-editor-action-list__item--separator + li").hide(), 0 == $action_list.find("li.tea-update-theme").length && $action_list.append($('<li><a href="#" class="theme-editor-action-list__item tea-update-theme">Import demo</a></li>')), $action_list.find("li:gt(3)").hide();
    var $importBtn = window.top.document.querySelector(".tea-update-theme");
    $importBtn.addEventListener("click", function() {
        console.log('aasdsad clicked')
        $("#tea-theme-update").trigger("click")
    }), 
    // $.get(window.teaUpdate.settings_data_json_url, function(t, e) {
    //     console.log(t, e), "success" == e && ($data = t.presets)
    // }), 
    $(document).on("click", "#tea-import-from-btn", function() {
        var t = $("#tea-import-from-text").val();
        $(".preloader").fadeIn(500, function() {
            $(".preloader").children().fadeIn(100)
        });
        try {
            importData(jsonToMap(JSON.parse(t), !1, "settings"))
        } catch (e) {
            console.log(e), alert("Import Errors"), $(".preloader").fadeOut(500, function() {
                $(".preloader").children().fadeOut(100)
            })
        }
    })
// Daniel Start ==========
    window.The4DropZoneDropped = (event) => {

        console.log("Dropped", event);


        // Prevent default behavior (Prevent file from being opened)
        event.preventDefault();
        event.target.classList.remove('the4-drag-over')
        if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (event.dataTransfer.items[i].kind === 'file') {
                    var file = event.dataTransfer.items[i].getAsFile();
                    //console.log('... file[' + i + '].name = ' + file.name);
                    window.The4ProcessFile(event.dataTransfer.files[0], event.target);
                    break;
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            // for (var i = 0; i < event.dataTransfer.files.length; i++) {
            // console.log('... file[' + i + '].name = ' + event.dataTransfer.files[i].name);
            // }
            window.The4ProcessFile(event.dataTransfer.files[0], event.target)
        }

    }
    window.The4ProcessFile = (file, target) => {
       //console.log('file.name: '+file.name)
            target.classList.remove('the4-drag-over');
            if (file.type !== "application/json") {alert("Please Select json file only");return;}

            var $img = $('#img_prv_t4'),
                $progress = $('#the4_dz_progress'),
                $mess_drop = $('#the4_mess_drop');

            $img.attr("src","none");
            const reader = new FileReader();
            // console.log('reader laod dd');
            $mess_drop.addClass('op_0');
            $progress.addClass('t4_upding');
            setTimeout(function(){ $progress.addClass('t4_up_doing'); }, 50);
            reader.onload = (event) => {
                // console.log('dsfds laod dd');
                $progress.addClass('t4_up_done');
                var layout = null;
                try {
                   var data = atob(event.target.result.split('base64,').pop());
                    layout = JSON.parse(data);
                    if (!layout) {
                        throw "Layout invalid";
                    }
                } catch (e) {
                    alert("Invalid sample file.");
                }
                if (layout) {
                    //console.log(layout);
                    //importData(jsonToMap(MergerSectionsData( layout.current), !1, "settings"))
                    // console.log('layout laod dd');
                    window.The4Data = layout.current;
                    
                    var imgurl = $img.data('src');
                    var name_img = file.name.replace(".json", "");
                     $img.attr("src",imgurl.replace("name_img", name_img));
                    $img.load(function(){
                      $('#the4_mess_notice').hide(); 
                      $('.claue-import').css('display','block');
                      $('.the4-drag-zone').css('display','none');
                      $progress.removeClass('t4_upding t4_up_doing t4_up_done');
                      $mess_drop.removeClass('op_0');
                     }).error(function(){
                       $('#the4_mess_notice').show();
                      $progress.removeClass('t4_upding t4_up_doing t4_up_done');
                      $mess_drop.removeClass('op_0');
                     });
                }
            };
            reader.readAsDataURL(file);
        },
        window.The4OnFileSelected = (event) => {
            document.querySelector('.the4-drag-zone').classList.remove('the4-drag-over');
            if (event.target.files && event.target.files.length) {
                var file = event.target.files[0];
                if (file.type !== "application/json") {

                    alert("Please Select json file only");
                    return;
                }
                window.The4ProcessFile(file, document.querySelector('.the4-drag-zone'));
            }
        },
          $(document).on('change','#the4-import-layout', (evt )=>{
                  window.The4OnFileSelected (evt);   
            //console.log('adasassa');
            $('#the4-import-layout').val(null);
           });
        $(document).on('click', '.the4-drag-zone', function(evt) {
            console.log('click drag');
            document.querySelector('#the4-import-layout').click();
        }),
        window.The4DragZoneOver = (evt) => {
            console.log("ondragover ");
            event.target.classList.add('the4-drag-over')
        },
        window.The4DragLeave = function(event) {
            event.target.classList.remove('the4-drag-over')
        }

        ,
        $(document).on("click", ".the4-cancel-btn", function(t) {
            $('.claue-import').css('display','none');
                    $('.the4-drag-zone').css('display','block');
            window.The4Data = null;
        })
        ,

        $(document).on("click", ".import-btn", function(t) {
            t.preventDefault(), 
              
            $(".preloader").fadeIn(500, function() {
                $(".preloader").children().fadeIn(100)
            });
            var e = $(this);
            if (!window.The4Data) return;
          
            importData(jsonToMap(MergerSectionsData(window.The4Data), !1, "settings")), $(".import-btn").removeClass("active"), e.addClass("active")
        }),

   /// ==========+End Daniel ====
        $(document).on("change", '[name="tab-group-1"]', function() {
            "export" == $(this).val() && $("#tea-form-export").val(JSON.stringify(getCurrentFormSettings()))
        });
})(jQuery);