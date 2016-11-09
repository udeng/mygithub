/**
 * Created by tanglinhai on 2016/9/12.
 */
module.exports = {
    getStyle: function(ele){
        if(typeof window.getComputedStyle != 'undefined'){
            return window.getComputedStyle(ele, null);
        }else if(ele.currentStyle){
            return ele.currentStyle;
        }else
            return null;
    },
    setStyle: function(ele, key, value, onSetInlineStyle = true){
        let styles = '';
        if(!onSetInlineStyle){
            const currStyles = this.getStyle(ele);
            if(currStyles)
                for(const k in currStyles){
                    if(k == key){
                        styles += key +':'+value+';';
                    }else{
                        styles += key +':'+currStyles[k]+';';
                    }
                }
        }else{
            styles += key +':'+value+';';
        }

        if(ele.setAttribute){
            ele.setAttribute('style', styles);
        }else{
            ele.style.cssText = styles;
        }
    }
}