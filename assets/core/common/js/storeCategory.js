webpackJsonp([8],{320:function(t,e,o){"use strict";function s(t){return t&&t.__esModule?t:{default:t}}var n=o(8),a=s(n);$("#btnCreateCategory").on("click",function(t){var e=t.target,o=$(e).closest("form").find('[name="id"]').val(),s={};return o?(a.default.form.fn.clear($(e).closest("form")),s.categoryName=o,void XE.ajax({type:"post",dataType:"json",data:s,url:storeCategoryInfo.url,success:function(t){var o=$(e).closest(".__xe_df_category");o.find('[name="categoryId"]').val(t.id),o.find("button").hide(),o.append($("<a>").text(storeCategoryInfo.text).prop("target","_blank").prop("href","/settings/category/"+t.id))}})):void a.default.form($(e),"You must first create a category ID.")})},8:function(t,e,o){"use strict";var s,n,a;"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(o,r){n=[e],s=r,a="function"==typeof s?s.apply(e,n):s,!(void 0!==a&&(t.exports=a))}(void 0,function(t){var e=jQuery=window.jQuery;DynamicLoadManager.cssLoad("/assets/core/common/css/griper.css"),t.options={toastContainer:{template:'<div class="__xe_toast_container xe-toast-container"></div>',boxTemplate:'<div class="toast_box"></div>'},toast:{classSet:{danger:"xe-danger",positive:"xe-positive",warning:"xe-warning",success:"xe-success",fail:"xe-fail",error:"xe-danger",info:"xe-positive"},expireTimes:{"xe-danger":0,"xe-positive":5,"xe-warning":10,"xe-success":2,"xe-fail":5},status:{500:"xe-danger",401:"xe-warning"},template:'<div class="alert-dismissable xe-alert" style="display:none;"><button type="button" class="__xe_close xe-btn-alert-close" aria-label="Close"><i class="xi-close"></i></button><span class="message"></span></div>'},form:{selectors:{elementGroup:".form-group",errorText:".__xe_error_text"},classes:{message:["error-text","__xe_error_text"]},tags:{message:"p"}}},t.toast=function(t,e){this.toast.fn.add(t,e)};var o=null;t.toast.fn=t.toast.prototype={constructor:t.toast,options:t.options.toast,statusToType:function(t){var e=this.options.status[t];return void 0===e?"xe-danger":e},add:function(e,o){return t.toast.fn.create(e,o),this},create:function(o,s){var n=0,o=this.options.classSet[o]||"xe-danger";0!=this.options.expireTimes[o]&&(n=parseInt((new Date).getTime()/1e3)+this.options.expireTimes[o]);var a=e(this.options.template);a.attr("data-expire-time",n).addClass(o),a.append(s),t.toast.fn.container().append(a),this.show(a)},show:function(t){t.slideDown("slow")},destroy:function(t){t.slideUp("slow",function(){t.remove()})},container:function s(){if(null!=o)return o;o=e(t.options.toastContainer.boxTemplate);var s=e(t.options.toastContainer.template).append(o);return e("body").append(s),s.on("click","button.__xe_close",function(o){t.toast.fn.destroy(e(this).parents(".xe-alert")),o.preventDefault()}),setInterval(function(){var s=parseInt((new Date).getTime()/1e3);o.find("div.xe-alert").each(function(){var o=parseInt(e(this).data("expire-time"));0!=o&&s>o&&t.toast.fn.destroy(e(this))})},1e3),o}},t.form=function(e,o){t.form.fn.putByElement(e,o)},t.form.fn=t.form.prototype={constructor:t.form,options:t.options.form,getGroup:function(t){return t.closest(this.options.selectors.elementGroup)},putByElement:function(t,e){this.put(this.getGroup(t),e,t)},put:function(t,o,s){1==t.length?t.append(e("<"+this.options.tags.message+">").addClass(this.options.classes.message.join(" ")).text(o)):0==t.length&&s.after(e("<"+this.options.tags.message+">").addClass(this.options.classes.message.join(" ")).text(o))},clear:function(t){t.find(this.options.tags.message+this.options.selectors.errorText).remove()}}})}},[320]);