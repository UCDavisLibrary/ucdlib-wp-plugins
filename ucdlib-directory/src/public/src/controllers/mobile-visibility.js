export class MobileVisibilityController {
  constructor(host, dbName){
    (this.host = host).addController(this);

    this.showOnMobile = false;
    this.dbName = dbName;
    this.dbStoreName = 'props';
    this.dbVersion = 1;
    this.db = false;
  }

  hostConnected(){
    // connect to db, set up schema if necessary
    if ( window.indexedDB ) {
      let req = window.indexedDB.open(this.dbName, this.dbVersion);

      req.onsuccess = event => {
        this._setDb(event);
        let tx = this.db.transaction([this.dbStoreName]);
        let objectStore = tx.objectStore(this.dbStoreName);
        var request = objectStore.get('showOnMobile');
        request.onsuccess = event => {
          this.showOnMobile = request.result.value;
        };
      }
      req.onerror = event => {
        console.warn("Database error: " + event.target.errorCode);
      }

      req.onupgradeneeded = event => {
        this._setDb(event);
        let objectStore = this.db.createObjectStore(this.dbStoreName, { keyPath: "name" });

        // write initial data
        objectStore.transaction.oncomplete = event => {
          let tx = this.db.transaction(this.dbStoreName, 'readwrite').objectStore(this.dbStoreName);
          const props = [
            {name: 'showOnMobile', value: this.showOnMobile}
          ];
          props.forEach(p => {
            tx.add(p);
          })
        }
      }
    }
  }


  _setDb(event){
    this.db = event.target.result;
    this.db.onerror = () => {
      console.warn("Database error: " + event.target.errorCode);
    }
  }

  toggle(){
    this.showOnMobile = !this.showOnMobile;
    if ( this.db ){
      let tx = this.db.transaction(this.dbStoreName, 'readwrite').objectStore(this.dbStoreName);
      tx.put({name: 'showOnMobile', value: this.showOnMobile});
    }
    this.host.requestUpdate();
  }
}