/**
 * --------------------------------------------------------------------------
 * Bootstrap List Editor (v0.0.1): list-editor.js
 * --------------------------------------------------------------------------
 */

import $ from 'jquery'

const Default = {
    editor: null,
    list  : null,
    model : null,
    items : {
        title : 'title',
        info  : [], // [{field,icon,title},...],
        action: [], // { edit: {icon,title}, remove: {icon,title}}
    }
}

class ListEditor {

    constructor(config){
        this._config    = this._getConfig(config)
        this._value     = '[]'
        this._el        = {
            editor : document.querySelector(this._config.editor),
            list   : document.querySelector(this._config.list),
            model  : document.querySelector(this._config.model)
        }
        this._activeIndex = null

        this._addElementsListener()
        this._redrawItems();
    }

    // private

    _addElementsListener(){
        this._el.model.addEventListener('change', e => this._redrawItems())

        this._el.editor.addEventListener('submit', e => {
            e.preventDefault()

            let value = {}
            let fInput = null
            for(let i=0; i<this._el.editor.elements.length; i++){
                let input = this._el.editor.elements[i]
                if(input.type === 'button')
                    continue
                value[ input.name ] = input.value
                input.value = ''
                if(!fInput)
                    fInput = input
            }

            if(this._activeIndex){
                this._value[this._activeIndex] = value
                this._el.model.value = JSON.stringify(this._value)
                this._redrawItems()
            }else{
                this._drawItem(value, this._value.length)
                this._updateModel()
            }

            this._activeIndex = null

            if(fInput)
                fInput.focus()
        })

        $(this._el.list)
        .on('click', '.btn-remove', e => {
            e.preventDefault()
            let list = e.target.closest('.list-editor-item')
            $(list).slideUp(f => {
                $(list).remove()
                this._updateModel()
            })
        })
        .on('click', '.btn-edit', e => {
            e.preventDefault()
            let list  = e.target.closest('.list-editor-item')
            let item  = JSON.parse(list.dataset.object)
            this._activeIndex = list.dataset.index

            let fInput = null
            for(let i=0; i<this._el.editor.elements.length; i++){
                let input = this._el.editor.elements[i]

                if(input.type === 'button')
                    continue
                input.value = item[input.name] || ''
                if(!fInput)
                    fInput = input
            }

            fInput.select()
            $('html, body').animate({
                scrollTop: $(this._el.editor).offset().top
            })
        })
    }

    _drawItem(item, index){
        let safe = {
            object: this._hs( JSON.stringify(item) ),
            title : item[ this._config.items.title ]
        }

        let infos = []
        this._config.items.info.forEach(info => {
            if(!item[info.field])
                return

            let safe = {
                title: this._hs( info.title ),
                text : this._hs( item[info.field] ),
                icon : info.icon || ''
            }

            let tmpl = `
                <span title="${safe.title}">
                    ${safe.icon}
                    ${safe.text}
                </span>`

            infos.push(tmpl)
        })
        infos = infos.join('&middot;')

        let actions = []
        for(let k in this._config.items.action){
            let action = this._config.items.action[k]
            let safe   = {
                class: 'btn-' + k,
                icon : action.icon || '',
                title: this._hs( action.title || '' )
            }

            let tmpl = `
                <a href="#0" class="btn btn-secondary ${safe.class}" title="${safe.title}">
                    ${safe.icon}
                </a>`

            actions.push(tmpl)
        }

        actions = actions.join('')

        let tmpl = `
            <li class="list-group-item list-editor-item" data-object="${safe.object}" data-index="${index}">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${safe.title}</h5>
                    <div>
                        <div class="btn-group btn-group-sm" role="group" aria-label="Action">
                            ${actions}
                        </div>
                    </div>
                </div>
                <small>${infos}</small>
            </li>`

        $(this._el.list).append(tmpl)
    }

    _getConfig(config){
        let conf = {}
        for(let k in Default){
            if('items' === k){
                conf[k] = {}
                if(config[k]){
                    for(let j in config[k])
                        conf[k][j] = typeof config[k][j] === 'undefined' ? Default[k][j] : config[k][j]
                }
            }else{
                conf[k] = typeof config[k] === 'undefined' ? Default[k] : config[k]
            }
        }

        return conf
    }

    _hs(text){
        return text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
    }

    _redrawItems(){
        this._value = this._el.model.value

        try{
            this._value = JSON.parse(this._value)
        }catch(e){
            this._value = []
        }

        this._el.list.innerHTML = ''
        this._value.forEach((item,index) => this._drawItem(item,index))
    }

    _updateModel(){
        let value = []

        for(let i=0; i<this._el.list.children.length; i++){
            let item = this._el.list.children[i]
            value.push( JSON.parse(item.dataset.object) )
        }

        this._value = value
        this._el.model.value = JSON.stringify(value)
    }
}

window.ListEditor = ListEditor
export default ListEditor