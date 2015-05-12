module.exports = {

  on(event, fn, context) {
    this._callbacks = this._callbacks || [];
    this._callbacks.push({ event, fn, context });
  },

  emit(event, ...args) {
    this._callbacks = this._callbacks || [];
    for (let callbackObj of this._callbacks) {
      if (callbackObj.event == event) 
        callbackObj.fn.call(callbackObj.context, ...args);
    }
  }

}