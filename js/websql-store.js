var WebSqlStore = function(successCallback, errorCallback) {
    console.log("NEW LOG " + new Date().getTime());
    var uuid = "12345";
    var platform = "Android";
    if (window.device != undefined) {
      uuid = window.device.uuid;
      platform = window.device.platform;
    }
    var networkState = "WIFI";
    if (navigator.network != undefined)
      networkState = navigator.network.connection.type;

    if (window.localStorage.getItem("WIFISync") == undefined)
      window.localStorage.setItem("WIFISync", "yes");

    console.log("NETWORK STATE : " + networkState);

    this.initializeDatabase = function(successCallback, errorCallback) {
    var self = this;
    this.db = window.openDatabase("BNI", "1.0", "BNI", 200000);
    this.db.transaction(
            function(tx) { console.log("inside db transaction");
                // Check if tables exist - if they do then user already exists, else create
                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='chapter';";
                tx.executeSql(sql, [], function(tx, results) {  console.log("web10");
                    if (results.rows.length == 0 || results.rows.length > 0) {
                      console.log("create tables");
                      // no user table so means we need to create all our tables...
                      self.createChapterTable(tx);
                      self.createMemberTable(tx);
                      self.createKeywordTable(tx);
                      self.createKeywordMemberTable(tx);
                      // Now we need to pass through to the server the details of this user.
                      self.loadXMLDoc(tx, uuid, platform, function( returnValue ){
                          this.db = window.openDatabase("BNI", "1.0", "BNI DB", 200000);
                          this.db.transaction(
                          function(tx) {
                            eval( returnValue );
                          });
                      });
                      window.localStorage.setItem("WIFISync", "yes");

                    }
                    else {
                      console.log("update tables");
                      self.loadXMLDoc(tx, uuid, platform, function( returnValue ){
                          this.db = window.openDatabase("BNI", "1.0", "BNI DB", 200000);
                          this.db.transaction(
                          function(tx) {
                            eval( returnValue );
                          });

                      });
                      if (window.localStorage.getItem("WIFISync") == undefined) {
                        window.localStorage.setItem("WIFISync", 'yes');
                      }

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

    this.createChapterTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS chapter');
        var sql = "CREATE TABLE IF NOT EXISTS chapter ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "chaptername VARCHAR(50), " +
            "venue VARCHAR(250), " +
            "city VARCHAR(50), " +
            "area VARCHAR(50), " +
            "meetingday VARCHAR(50), " +
            "meetingtime VARCHAR(50))";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.createMemberTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS member');
        var sql = "CREATE TABLE IF NOT EXISTS member ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "name VARCHAR(50), " +
            "company VARCHAR(50), " +
            "phone VARCHAR(50), " +
            "mobile VARCHAR(50), " +
            "website VARCHAR(250), " +
            "address VARCHAR(250), " +
            "chapterId INTEGER)";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.createKeywordTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS keyword');
        var sql = "CREATE TABLE IF NOT EXISTS keyword ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "keyword VARCHAR(50))";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.createKeywordMemberTable = function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS keywordmember');
        var sql = "CREATE TABLE IF NOT EXISTS keywordmember ( " +
            "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "keyid INTEGER, " +
            "memberid INTEGER)";
        tx.executeSql(sql, null,
                function() {
                    console.log('Create table success');
                },
                function(tx, error) {
                    alert('Create table error: ' + error.message);
                });
    }

    this.findByName = function(searchKey, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " +
                    "FROM member e LEFT JOIN member r ON r.managerId = e.id " +
                    "WHERE e.firstName || ' ' || e.lastName LIKE ? " +
                    "GROUP BY e.id ORDER BY e.lastName, e.firstName";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        members = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        members[i] = results.rows.item(i);
                    }
                    callback(members);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.name, e.company, e.phone, e.mobile, e.website, e.address, e.chapterid as chapterid, c.chaptername, group_concat(k.keyword) as keywords " +
                    "FROM member e " +
                    "LEFT JOIN chapter c on c.id = e.chapterid " +
                    "LEFT JOIN keywordmember km on km.memberid = e.id " +
                    "LEFT JOIN keyword k on k.id = km.keyid " +
                    "WHERE e.id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.findAllChapters = function(callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.chaptername, e.venue, e.city, e.area, e.meetingday, e.meetingtime " +
                    "FROM chapter e";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        chapters = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        chapters[i] = results.rows.item(i);
                    }
                    callback(chapters);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findChapterMembersById = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.chaptername, e.venue, e.city, e.area, e.meetingday, e.meetingtime, m.id as memberid, m.name, m.chapterid, m.company " +
                    "FROM chapter e " +
                    "LEFT JOIN member m ON m.chapterid = e.id " +
                    "WHERE e.id=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    var len = results.rows.length,
                        members = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        members[i] = results.rows.item(i);
                    }
                    callback(members);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    };

    this.findIndustryByName = function(searchKey, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.keyword " +
                    "FROM keyword e " +
                    "WHERE e.keyword LIKE ? " +
                    "GROUP BY e.id ORDER BY e.keyword";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        members = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        members[i] = results.rows.item(i);
                    }
                    callback(members);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.findAllIndustries = function(callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.keyword " +
                    "FROM keyword e ";

                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        industries = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        var obj = { value: results.rows.item(i).id, label: results.rows.item(i).keyword };
                        industries.push(obj);
                    }
                    callback(industries);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }


    this.findMembersByIndustry = function(id, callback) {
        this.db.transaction(
            function(tx) {

                var sql = "SELECT e.id, e.keyid, e.memberid, m.id as memberid, m.name, m.chapterid, m.company, c.area, k.keyword   " +
                    "FROM keywordmember e " +
                    "LEFT JOIN member m ON m.id = e.memberid " +
                    "LEFT JOIN chapter c ON c.id = m.chapterid " +
                    "LEFT JOIN keyword k on k.id = e.keyid " +
                    "WHERE e.keyid=:id";

                tx.executeSql(sql, [id], function(tx, results) {
                    var len = results.rows.length,
                        members = [],
                        i = 0;
                    for (; i < len; i = i + 1) {
                        members[i] = results.rows.item(i);
                    }
                    callback(members);
                });
            },
            function(error) {
                alert("Transaction Error: " + error.message);
            }
        );
    }

    this.loadXMLDoc = function (tx, uuid, platform, cdFunc)
    {
      $.ajax({
           type: 'POST',
           url: "http://dev.maltec.co.za/bnikzn/cgi-bin/server.php?" + "uuid=" + uuid + "&amp;platform=" + platform,
           processData: true,
           data: {'uuid' : uuid, 'platform' : platform},
           success: function (data) {
               alert("success in calling server.php");
               cdFunc(data);
           }
      });
  }
  console.log("web6");

  if (window.localStorage.getItem("WIFISync") == "yes" && networkState == "WIFI") {
    console.log("call init db...");
    this.initializeDatabase(successCallback, errorCallback);

  }

}

  function addChapterData(tx, chapters) {
        var l = chapters.length;
        var sql = "INSERT OR REPLACE INTO chapter " +
            "(id, chaptername, venue, city, area, meetingday, meetingtime) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = chapters[i];
            tx.executeSql(sql, [e.id, e.chaptername, e.venue, e.city, e.area, e.meetingday, e.meetingtime],
                    function() {
                        //console.log('INSERT success');
                    },
                    function(tx, error) {
                        alert('INSERT error: ' + error.message);
                    });
        }
    }

    function addMemberData(tx, members) {
        var l = members.length;
        var sql = "INSERT OR REPLACE INTO member " +
            "(id, name, chapterId, company, phone, mobile, website, address) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = members[i];
            tx.executeSql(sql, [e.id, e.name, e.chapterId, e.company, e.phone, e.mobile, e.website, e.address],
                    function() {
                        //console.log('INSERT success');
                    },
                    function(tx, error) {
                        alert('INSERT error: ' + error.message);
                    });
        }
    }

    function addKeywordData(tx, keywords) {
        var l = keywords.length;
        var sql = "INSERT OR REPLACE INTO keyword " +
            "(id, keyword) " +
            "VALUES (?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = keywords[i];
            tx.executeSql(sql, [e.id, e.keyword],
                    function() {
                        //console.log('INSERT success');
                    },
                    function(tx, error) {
                        alert('INSERT error: ' + error.message);
                    });
        }
    }

    function addKeywordMemberData(tx, keywordmembers) {
        var l = keywordmembers.length;
        var sql = "INSERT OR REPLACE INTO keywordmember " +
            "(id, keyid, memberid) " +
            "VALUES (?, ?, ?)";
        var e;
        for (var i = 0; i < l; i++) {
            e = keywordmembers[i];
            tx.executeSql(sql, [e.id, e.keyid, e.memberid],
                    function() {
                        //console.log('INSERT success');
                    },
                    function(tx, error) {
                        alert('INSERT error: ' + error.message);
                    });
        }
    }
