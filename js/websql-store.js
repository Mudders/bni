var WebSqlStore = function(successCallback, errorCallback) {
    //console.log(new Date().getTime())
    var $scope = angular.element('body').scope();
    //alert("SDf");
    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("BNI", "1.0", "BNI", 200000);
        this.db.transaction(
                function(tx) {
                    // Check if tables exist - if they do then user already exists, else create
                    var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='user';";
                    tx.executeSql(sql, [], function(tx, results) {
                        if (results.rows.length == 0) {
                          // no user table so means we need to create all our tables...
                          self.createChapterTable(tx);
                          self.createMemberTable(tx);
                          self.createKeywordTable(tx);
                          self.createKeywordMemberTable(tx);
                          self.createUserTable(tx);
                          // Now we need to pass through to the server the details of this user.
                          self.loadXMLDoc(tx);
                        }
                        else {
                          self.loadXMLDoc(tx, "123456", "Android", function( returnValue ){
                              this.db = window.openDatabase("BNIDB1", "1.0", "BNI DB", 200000);
                              this.db.transaction(
                              function(tx) {
                                eval( returnValue );
                              });
                          });
                        }
                    });

                },
                function(error) {
                    console.log('Transaction error: ' + error);
                    if (errorCallback) errorCallback();
                },
                function() {
                    console.log('Transaction success');
                    if (successCallback) successCallback();
                }
        )
    }


    this.loadXMLDoc = function (uuid, platform)
    {
      $.ajax({
           type: 'POST',
           url: "http://dev.maltec.co.za/bnikzn/cgi-bin/server1.php?" + "uuid=" + uuid + "&amp;platform=" + platform,
           processData: true,
           data: {'uuid' : uuid, 'platform' : platform},
           success: function (data) {
               alert("5 " + data);
           }
      });
  }

  this.loadXMLDoc(device.uuid, device.platform)

}

