(function ($, XE, _) {
  $.widget('xe.uioMedialibraryImage', {
    // default options
    options: {
      valueTarget: 'media_id',
      name: 'image[]',
      seq: 0,
      preview: true,
      max: 1,
      typeFilter: 'image/*',
      files: [],
      image: null,
      templates: {
        previewContainer: '<ul class="ml-image__preview"></ul>',
        previewItem: '<li class="ml-image__preview-item"><input type="hidden" class="ml-image__field" name="image[]"><img class="ml-image__preview-image" /><button type="button" class="ml-image__remove"><i class="xi-close-circle"></i></button></li>'
      }
    },

    // The constructor
    _create: function () {
      var that = this

      $(this.element).on('click', '.ml-image__add', function () {
        that._importFile()
      })
      $(this.element).on('click', '.ml-image__remove', function () {
        that._removeFile($(this).closest('li').find('input').val())
      })

      this._refresh()
    },
    _init: function () {
      console.debug('@_init')
    },

    // Called when created, and later when changing options
    _refresh: function () {
      console.debug('@_refresh')
      this._renderList()
    },

    _importFile: function () {
      var that = this

      XE.app('MediaLibrary').then(function (appMediaLibrary) {
        appMediaLibrary.open({
          selected: function (mediaList) {
            var list = []
            _.forEach(mediaList, function (media) {
              list.push({
                media_id: media.id,
                file_id: media.file_id,
                preview: _.get(media, 'file.url', null)
              })
            })

            that._addFiles(list)
            that._refresh()
          }
        })
      })
    },

    _removeFile: function (targetId) {
      var that = this
      this.options.files.splice(_.findIndex(this.options.files, function (item) { return item.file_id === targetId }), 1)
      that._renderList()
    },

    _renderList: function () {
      var that = this
      var fileList = this._getFiles()
      var $tempEl = $('<ul>')

      _.forEach(fileList, function (file) {
        var $item = $(that.options.templates.previewItem)
        var fieldValue = (that.options.valueTarget === 'file_id') ? file.fileId() : file.mediaId()

        $item.find('.ml-image__preview-image').attr('src', file.previewUrl())
        $item.find('.ml-image__field')
          .attr('name', that.options.name)
          .val(fieldValue)

        $tempEl.append($item)
      })

      $(this.element).find('.ml-image__preview').empty().append($tempEl.find('li'))
    },

    _addFiles: function (files) {
      var that = this
      _.forEach(files, function (file) {
        that._addFile(file)
      })
    },

    _addFile: function (file) {
      console.debug('@_addFile', this, file)
      this.options.files.push(file)
    },

    _getFiles: function () {
      var files = []
      _.forEach(this.options.files, function (item) {
        files.push(new FileItem(item))
      })

      return files
    },

    // Events bound via _on are removed automatically
    // revert other modifications here
    _destroy: function () {
      console.debug('@_destroy')
      // remove generated elements
      // this.changer.remove()

      // this.element
      //   .removeClass('custom-colorize')
      //   .enableSelection()
      //   .css('background-color', 'transparent')
    },

    // _setOptions is called with a hash of all options that are changing
    // always refresh when changing options
    _setOptions: function () {
      console.debug('@_setOptions')
      // _super and _superApply handle keeping the right this-context
      this._superApply(arguments)
      this._refresh()
    },

    // _setOption is called for each individual option that is changing
    _setOption: function (key, value) {
      console.debug('@_setOption')
      this._super(key, value)
    }
  })

  var FileItem = function (item) {
    this.item = item

    var that = this

    return {
      fileId: function () {
        return _.get(that.item, 'file_id', null)
      },
      mediaId: function () {
        return _.get(that.item, 'media_id', null)
      },
      mime: function () {
        return _.get(that.item, 'mime', null)
      },
      previewUrl: function () {
        return _.get(that.item, 'preview', null)
      },
      hasPreview: function () {
        return !!_.get(that.item, 'preview', false)
      },

      raw: this.item
    }
  }
})(window.jQuery, window.XE, window.XE._)