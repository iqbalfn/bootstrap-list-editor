/*!
  * Bootstrap List Editor v0.0.3 (https://iqbalfn.github.io/bootstrap-list-editor/)
  * Copyright 2020 Iqbal Fauzi
  * Licensed under MIT (https://github.com/iqbalfn/bootstrap-list-editor/blob/master/LICENSE)
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
    (global = global || self, factory(global['bootstrap-list-editor'] = {}, global.jQuery));
}(this, (function (exports, $) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    /**
     * --------------------------------------------------------------------------
     * Bootstrap List Editor (v0.0.1): list-editor.js
     * --------------------------------------------------------------------------
     */
    var Default = {
      editor: null,
      list: null,
      model: null,
      items: {
        title: 'title',
        info: [],
        // [{field,icon,title},...],
        action: [] // { edit: {icon,title}, remove: {icon,title}}

      }
    };

    var ListEditor =
    /*#__PURE__*/
    function () {
      function ListEditor(config) {
        this._config = this._getConfig(config);
        this._value = '[]';
        this._el = {
          editor: document.querySelector(this._config.editor),
          list: document.querySelector(this._config.list),
          model: document.querySelector(this._config.model)
        };
        this._activeIndex = null;

        this._addElementsListener();

        this._redrawItems();
      } // private


      var _proto = ListEditor.prototype;

      _proto._addElementsListener = function _addElementsListener() {
        var _this = this;

        this._el.model.addEventListener('change', function (e) {
          return _this._redrawItems();
        });

        this._el.editor.addEventListener('submit', function (e) {
          e.preventDefault();
          var value = {};
          var fInput = null;

          for (var i = 0; i < _this._el.editor.elements.length; i++) {
            var input = _this._el.editor.elements[i];
            if (input.type === 'button') continue;
            value[input.name] = input.value;
            input.value = '';
            if (!fInput) fInput = input;
          }

          if (_this._activeIndex) {
            _this._value[_this._activeIndex] = value;
            _this._el.model.value = JSON.stringify(_this._value);

            _this._redrawItems();
          } else {
            _this._drawItem(value, _this._value.length);

            _this._updateModel();
          }

          _this._activeIndex = null;
          if (fInput) fInput.focus();
        });

        $(this._el.list).on('click', '.btn-remove', function (e) {
          e.preventDefault();
          var list = e.target.closest('.list-editor-item');
          $(list).slideUp(function (f) {
            $(list).remove();

            _this._updateModel();
          });
        }).on('click', '.btn-edit', function (e) {
          e.preventDefault();
          var list = e.target.closest('.list-editor-item');
          var item = JSON.parse(list.dataset.object);
          _this._activeIndex = list.dataset.index;
          var fInput = null;

          for (var i = 0; i < _this._el.editor.elements.length; i++) {
            var input = _this._el.editor.elements[i];
            if (input.type === 'button') continue;
            input.value = item[input.name] || '';
            if (!fInput) fInput = input;
          }

          fInput.select();
          $('html, body').animate({
            scrollTop: $(_this._el.editor).offset().top
          });
        });
      };

      _proto._drawItem = function _drawItem(item, index) {
        var _this2 = this;

        var safe = {
          object: this._hs(JSON.stringify(item)),
          title: item[this._config.items.title]
        };
        var infos = [];

        this._config.items.info.forEach(function (info) {
          if (!item[info.field]) return;
          var safe = {
            title: _this2._hs(info.title),
            text: _this2._hs(item[info.field]),
            icon: info.icon || ''
          };
          var tmpl = "\n                <span title=\"" + safe.title + "\">\n                    " + safe.icon + "\n                    " + safe.text + "\n                </span>";
          infos.push(tmpl);
        });

        infos = infos.join('&middot;');
        var actions = [];

        for (var k in this._config.items.action) {
          var action = this._config.items.action[k];
          var _safe = {
            "class": 'btn-' + k,
            icon: action.icon || '',
            title: this._hs(action.title || '')
          };

          var _tmpl = "\n                <a href=\"#0\" class=\"btn btn-secondary " + _safe["class"] + "\" title=\"" + _safe.title + "\">\n                    " + _safe.icon + "\n                </a>";

          actions.push(_tmpl);
        }

        actions = actions.join('');
        var tmpl = "\n            <li class=\"list-group-item list-editor-item\" data-object=\"" + safe.object + "\" data-index=\"" + index + "\">\n                <div class=\"d-flex w-100 justify-content-between\">\n                    <h5 class=\"mb-1\">" + safe.title + "</h5>\n                    <div>\n                        <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Action\">\n                            " + actions + "\n                        </div>\n                    </div>\n                </div>\n                <small>" + infos + "</small>\n            </li>";
        $(this._el.list).append(tmpl);
      };

      _proto._getConfig = function _getConfig(config) {
        var conf = {};

        for (var k in Default) {
          if ('items' === k) {
            conf[k] = {};

            if (config[k]) {
              for (var j in config[k]) {
                conf[k][j] = typeof config[k][j] === 'undefined' ? Default[k][j] : config[k][j];
              }
            }
          } else {
            conf[k] = typeof config[k] === 'undefined' ? Default[k] : config[k];
          }
        }

        return conf;
      };

      _proto._hs = function _hs(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      };

      _proto._redrawItems = function _redrawItems() {
        var _this3 = this;

        this._value = this._el.model.value;

        try {
          this._value = JSON.parse(this._value);
        } catch (e) {
          this._value = [];
        }

        this._el.list.innerHTML = '';

        this._value.forEach(function (item, index) {
          return _this3._drawItem(item, index);
        });
      };

      _proto._updateModel = function _updateModel() {
        var value = [];

        for (var i = 0; i < this._el.list.children.length; i++) {
          var item = this._el.list.children[i];
          value.push(JSON.parse(item.dataset.object));
        }

        this._value = value;
        this._el.model.value = JSON.stringify(value);
      };

      return ListEditor;
    }();

    window.ListEditor = ListEditor;

    exports.ListEditor = ListEditor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bootstrap-list-editor.js.map
