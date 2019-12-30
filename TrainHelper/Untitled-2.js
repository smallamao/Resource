/**
 * 要保書欄位轉換用的套印規則
 */
mappKeyinValidators.prototype.P011 = (function() {
    /**
     * 判斷受益人國籍是否為'TWN'，若是'TWN'則將數值清空不顯示
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function checkI_Nationality(dataFieldName) {
      if (this[dataFieldName].saveValue == 'TWN') {
        o[dataFieldName] = {
          saveValue: this[dataFieldName].saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
    }
  
    /**
     * 國籍判斷是否為'TWN'，若不是'TWN'則將數值寫入其他欄位
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function checkNationality(dataFieldName) {
  
      var otherNationality = dataFieldName.concat('_OTHER');
  
      if (this[dataFieldName].saveValue == 'TWN') {
        o[otherNationality] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      } else {
  
        // 國籍清單
        var countryArr = sysMenu['10009'];
  
        for (var i = 0; i < countryArr.length; i++) {
  
          if (countryArr[i].CodeNo == this[dataFieldName].saveValue) {
  
            o[otherNationality] = {
              saveValue: this[dataFieldName].saveValue,
              displayValue: countryArr[i].CodeName,
              count1: 1,
              count2: 1
            };
  
            break;
          }
  
        }
      }
    }
  
    /**
     * 幣別判斷是否為'TWD' or 'USD'，若不是則將數值寫入'幣別_套印用'
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function currencyForPrint(dataFieldName) {
  
      if (this[dataFieldName].saveValue == 'TWD' || this[dataFieldName].saveValue == 'USD') {
        o['DISPLAY_28'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      } else {
        o['DISPLAY_28'] = {
          saveValue: this[dataFieldName].saveValue,
          displayValue: this[dataFieldName].displayValue,
          count1: 1,
          count2: 1
        };
      }
    }
  
    /**
     * 要被保人同一人時，清空「主被保險人_與法定代理人關係_其他說明(I_CHKFLAG10_OTHER)」的display Value
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function clearICHKFLAG_OTHER(dataFieldName) {
  
      if (this[dataFieldName].saveValue == 1) {
        o['I_CHKFLAG10_OTHER'] = {
          saveValue: this['I_CHKFLAG10_OTHER'].saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
    }
  
    /**
     * 將性別M/F轉換為男/女
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function sexText(dataFieldName) {
  
      var sexText = 'CNA_' + dataFieldName;
  
      if (this[dataFieldName].saveValue == 'F') {
        o[sexText] = {
          saveValue: this[dataFieldName].saveValue,
          displayValue: '女',
          count1: 1,
          count2: 1
        };
      } else {
        o[sexText] = {
          saveValue: this[dataFieldName].saveValue,
          displayValue: '男',
          count1: 1,
          count2: 1
        };
      }
    }
  
    /**
     * 欲投保金額轉換(原P005)
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function exchangeSumins(dataFieldName, unit, prodCode) {
      var productData = mpsform.app.page.contracts[this[prodCode].saveValue];
      var productType = productData.prodTypeList[0].typeCode;
      if (productType === '01') {
        o['VIEW42'] = {
          saveValue: this[dataFieldName].saveValue + '元',
          displayValue: this[dataFieldName].displayValue + '元',
          count1: 1,
          count2: 1
        };
      } else {
        if (productData.unit == '1') {
          o['VIEW42'] = {
            saveValue: this[dataFieldName].saveValue + '元',
            displayValue: this[dataFieldName].displayValue + '元',
            count1: 1,
            count2: 1
          };
        } else if (productData.unit == '100') {
          o['VIEW42'] = {
            saveValue: parseInt((this[dataFieldName].saveValue + '00').replace(/,/g, '')).toLocaleString() + '元',
            displayValue: parseInt((this[dataFieldName].saveValue + '00').replace(/,/g, '')).toLocaleString() + '元',
            count1: 1,
            count2: 1
          };
        } else if (productData.unit == '1000') {
          o['VIEW42'] = {
            saveValue: parseInt((this[dataFieldName].saveValue + '000').replace(/,/g, '')).toLocaleString() + '元',
            displayValue: parseInt((this[dataFieldName].saveValue + '000').replace(/,/g, '')).toLocaleString() + '元',
            count1: 1,
            count2: 1
          };
        } else if (productData.unit == '10000') {
          o['VIEW42'] = {
            saveValue: this[dataFieldName].saveValue + '萬元',
            displayValue: this[dataFieldName].saveValue + '萬元',
            count1: 1,
            count2: 1
          };
        }
      }
    }
  
    /**
     * 稅籍編號狀態若值為1時，套印清空
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function taxNoStatus(tableName, dataFieldName) {
      var eTableArr = this[tableName];
      // var clearSaveValue = this[tableName][dataFieldName].saveValue;
      // 檢核保單是否有ETABLE
      if (!eTableArr) {
        return;
      }
      for (var i = 0; i < eTableArr.length; i++) {
        if (eTableArr[i][dataFieldName].saveValue == 1) {
          eTableArr[i][dataFieldName].displayValue = '';
        }
      }
    }
  
  
    /**
     * 處理E_TABLE投資組合內基金代碼
     * @param {*} tableName 需要判斷的Table
     * @param {*} dataFieldName 需要處理的欄位名稱
     */
    function checkFundName(tableName, dataFieldName) {
  
      var eTableArr = this[tableName];
      // 檢核保單是否有ETABLE
      if (!eTableArr) {
        return;
      }
  
      for (var i = 0; i < eTableArr.length; i++) {
        eTableArr[i][dataFieldName].displayValue = eTableArr[i][dataFieldName].displayValue.split("-")[0];
  
        // 判斷是否為靈活配置轉出投資標的Table
        if (tableName == 'E_TABLE06') {
  
          if (this.TRANSFOUT_TYPE.saveValue == 1) {
            eTableArr[i].TRANSFOUT_AMOUNT.displayValue = '';
            eTableArr[i].TRANSFOUT_AMOUNT.saveValue = '';
          } else {
            eTableArr[i].TRANSFOUT_PERCENT.displayValue = '';
            eTableArr[i].TRANSFOUT_PERCENT.saveValue = '';
          }
        }
      }
    }
    /**
     * (告知套印用)判斷有值為Y，全空為空，else為N
     * @param {*} judgment1 判斷式(為布林值)若為Y是true否則為false
     */
    function checkI_NOTI_YN(judgment1) {
      if (judgment1) {
        return 'Y';
      } else {
        return 'N';
      }
    }
    /**
     * 判斷主約附約有沒有豁免
     * @param {*} tableName 需要判斷的Table
     * @param {*} dataFieldName1 需要處理的欄位名稱
     * @param {*} dataFieldName2 主約欄位
     */
    function checkExemption(tableName, dataFieldName1, dataFieldName2) {
      var exemption = false;
      var eTableArr = this[tableName];
      //主約
      var mainContract = this[dataFieldName2].saveValue;
      // 檢核保單是否有ETABLE
      if (!eTableArr) {
        return false;
      }
      //若沒有附約及主約豁免險種
      if (!!!mpsform.app.page.contracts[mainContract].riders && mpsform.app.page.contracts[mainContract].exemption == "N") {
        exemption = false;
      }
      for (var i = 0; i < eTableArr.length; i++) {
        //附約險種
        var rider = eTableArr[i][dataFieldName1].saveValue;
        //假設沒有抓到附約險種，代表表格為空
        if (!rider) {
          break;
        }
        if (mpsform.app.page.contracts[rider].exemption != 'N') {
          exemption = true;
          break;
        }
      }
      return exemption;
    }
    /**
     * 把主附約轉換成告知陣列
     * @param {*} tableName 需要判斷的Table
     * @param {*} dataFieldName1 需要處理的欄位名稱
     * @param {*} dataFieldName2 主約欄位
     */
    function transNotiArr(tableName, dataFieldName1, dataFieldName2) {
      var eTableArr = this[tableName];
      var Arr = [];
      //主約
      var mainContract = this[dataFieldName2].saveValue;
      Arr.push(mainContract);
      // 檢核保單是否有ETABLE
      if (!!eTableArr) {
        for (var i = 0; i < eTableArr.length; i++) {
          //附約險種
          var rider = eTableArr[i][dataFieldName1].saveValue;
          //假設沒有抓到附約險種，代表表格為空
          if (!rider) {
            break;
          }
          Arr.push(rider);
        }
      }
      var TypeArr = new Array();
      //把險種陣列轉成告知陣列
      for (var i = 0; i < Arr.length; i++) {
  
        var sc = mpsform.app.page.contracts[Arr[i]];
        if (!sc) {
          continue;
        }
        var noti = sc.notifyTypeList.split(',');
        TypeArr = TypeArr.concat(noti);
      }
      //去除重複值
      TypeArr = TypeArr.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
      });
      return TypeArr;
    }
    /**
     * 判斷告知的套印
     * @param {*} dataFieldName1 需要判斷的險種
     * @param {*} dataFieldName2 需要判斷的通路
     * @param {*} dataFieldName3 需要商品種類
     * @param {*} dataFieldName3 判斷豁免
     */
    function checkI_NOTI(dataFieldName1, dataFieldName2, dataFieldName3, exemptionYN) {
      //壽險告知
      var display_14 = "";
      //健康險告知
      var display_15 = "";
      //癌症險告知
      var display_16 = "";
      //全民健康保險重大傷病範圍保險告知
      var display_17 = "";
      //傷害險告知
      var display_18 = "";
      //要保人豁免保險費附約告知
      var display_19 = "";
      //配偶告知
      var display_20 = "";
      //子女1告知
      var display_21 = "";
      //子女2告知
      var display_22 = "";
      //是否同一人
      var I_RELA_CODE = this['I_RELA_CODE'].saveValue;
      //被保人
      // var I_NOTI = this['I_NOTI'].saveValue;
      var I_NOTI_Q5 = this['I_NOTI_Q5'].saveValue;
      var I_NOTI_Q2 = this['I_NOTI_Q2'].saveValue;
      var I_NOTI_Q4 = this['I_NOTI_Q4'].saveValue;
      var I_NOTI_Q1 = this['I_NOTI_Q1'].saveValue;
      var I_NOTI_Q3 = this['I_NOTI_Q3'].saveValue;
      var I_NOTI_Q6 = this['I_NOTI_Q6'].saveValue;
      var I_NOTI_Q7 = this['I_NOTI_Q7'].saveValue;
      var I_NOTI_Q8 = this['I_NOTI_Q8'].saveValue;
      //要保人(傳統台外幣有)
      // var WAIVER_I_NOTI = "";
      var WAIVER_I_NOTI_Q1 = "";
      var WAIVER_I_NOTI_Q2 = "";
      var WAIVER_I_NOTI_Q3 = "";
      var WAIVER_I_NOTI_Q4 = "";
      var WAIVER_I_NOTI_Q5 = "";
      var WAIVER_I_NOTI_Q6 = "";
      var WAIVER_I_NOTI_Q7 = "";
      var WAIVER_I_NOTI_Q8 = "";
      if (['0000', '0001'].indexOf(dataFieldName3) > -1) {
        // WAIVER_I_NOTI = this['WAIVER_I_NOTI'].saveValue;
        WAIVER_I_NOTI_Q1 = this['WAIVER_I_NOTI_Q1'].saveValue;
        WAIVER_I_NOTI_Q2 = this['WAIVER_I_NOTI_Q2'].saveValue;
        WAIVER_I_NOTI_Q3 = this['WAIVER_I_NOTI_Q3'].saveValue;
        WAIVER_I_NOTI_Q4 = this['WAIVER_I_NOTI_Q4'].saveValue;
        WAIVER_I_NOTI_Q5 = this['WAIVER_I_NOTI_Q5'].saveValue;
        WAIVER_I_NOTI_Q6 = this['WAIVER_I_NOTI_Q6'].saveValue;
        WAIVER_I_NOTI_Q7 = this['WAIVER_I_NOTI_Q7'].saveValue;
        WAIVER_I_NOTI_Q8 = this['WAIVER_I_NOTI_Q8'].saveValue;
      }
      var NotiArr = transNotiArr.call(this, 'TABLE11', 'R_PRO_CODE', 'M1_PRO_CODE');
      //套印欄位判斷
      var I_NOTI_Q2Q3Q5_Y = I_NOTI_Q2 == 'Y' || I_NOTI_Q3 == 'Y' || I_NOTI_Q5 == 'Y';
      var I_NOTI_Q1ToQ7 = I_NOTI_Q1 == 'Y' || I_NOTI_Q2 == 'Y' || I_NOTI_Q3 == 'Y' || I_NOTI_Q4 == 'Y' || I_NOTI_Q5 == 'Y' || I_NOTI_Q6 == 'Y' || I_NOTI_Q7 == 'Y';
      var I_NOTI_Q1ToQ8_Y = I_NOTI_Q1 == 'Y' || I_NOTI_Q2 == 'Y' || I_NOTI_Q3 == 'Y' || I_NOTI_Q4 == 'Y' || I_NOTI_Q5 == 'Y' || I_NOTI_Q6 == 'Y' || I_NOTI_Q7 == 'Y' || I_NOTI_Q8 == 'Y';
      var WAIVER_I_NOTI_Q1ToQ8_Y = WAIVER_I_NOTI_Q1 == 'Y' || WAIVER_I_NOTI_Q2 == 'Y' || WAIVER_I_NOTI_Q3 == 'Y' || WAIVER_I_NOTI_Q4 == 'Y' || WAIVER_I_NOTI_Q5 == 'Y' || WAIVER_I_NOTI_Q6 == 'Y' || WAIVER_I_NOTI_Q7 == 'Y' || WAIVER_I_NOTI_Q8 == 'Y';
      //投資台幣 EX:誠意滿滿台幣
      if (this[dataFieldName1].saveValue == 'AFVLB1') {
        if (NotiArr.indexOf('9') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q2Q3Q5_Y);
        }
      }
      //投資外幣 EX:誠意滿滿外幣
      if (this[dataFieldName1].saveValue == 'AFVLBF2') {
        if (NotiArr.indexOf('9') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q2Q3Q5_Y);
        }
      }
      //傳統人身台幣 EX:富利一生台幣
      if (this[dataFieldName1].saveValue == 'ACLPLN2' && this[dataFieldName2].saveValue == 'BR') {
        if (NotiArr.indexOf('0') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q1ToQ7);
        }
        if (NotiArr.indexOf('8') > -1) {
          display_15 = checkI_NOTI_YN(I_NOTI_Q8);
        }
        //要被保人同一人，豁元乙不用套印問項
        if (I_RELA_CODE == '1') {
          display_19 = '';
        }
        //要被保人同一人，豁元甲套印問項
        else if (exemptionYN && I_RELA_CODE == '') {
          display_19 = checkI_NOTI_YN(WAIVER_I_NOTI_Q1ToQ8_Y);
        }
      }
      //傳統外幣(主附約版) EX:美富人生外幣、美利人生外幣、美利傳家外幣，BR版
      if ((this[dataFieldName1].saveValue == 'ACLPLU3' || this[dataFieldName1].saveValue == 'CCLPLU1' || this[dataFieldName1].saveValue == 'ARIPLU2') && this[dataFieldName2].saveValue == 'BR') {
        if (NotiArr.indexOf('0') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q1ToQ7);
        }
        if (NotiArr.indexOf('8') > -1) {
          display_15 = checkI_NOTI_YN((I_NOTI_Q8 == 'Y'));
        }
        //要被保人同一人，豁元乙不用套印問項
        if (I_RELA_CODE == '1') {
          display_19 = '';
        }
        //要被保人同一人，豁元甲套印問項
        else if (exemptionYN && I_RELA_CODE == '') {
          display_19 = checkI_NOTI_YN(WAIVER_I_NOTI_Q1ToQ8_Y);
        }
      }
      //傳統外幣(A版) EX:美利人生外幣、美利傳家外幣，BD版
      if ((this[dataFieldName1].saveValue == 'ACLPLU3' || this[dataFieldName1].saveValue == 'CCLPLU1' || this[dataFieldName1].saveValue == 'ARIPLU2') && this[dataFieldName2].saveValue == 'BD') {
        I_NOTI_Q1 = I_NOTI_Q1 != '' ? I_NOTI_Q1 : 'N';
        I_NOTI_Q2 = I_NOTI_Q2 != '' ? I_NOTI_Q2 : 'N';
        I_NOTI_Q3 = I_NOTI_Q3 != '' ? I_NOTI_Q3 : 'N';
        I_NOTI_Q4 = I_NOTI_Q4 != '' ? I_NOTI_Q4 : 'N';
        I_NOTI_Q5 = I_NOTI_Q5 != '' ? I_NOTI_Q5 : 'N';
        I_NOTI_Q6 = I_NOTI_Q6 != '' ? I_NOTI_Q6 : 'N';
        I_NOTI_Q7 = I_NOTI_Q7 != '' ? I_NOTI_Q7 : 'N';
      }
      //傳統壽險台幣 EX:富利一生台幣
      if (this[dataFieldName1].saveValue == 'ACLPLN2' && this[dataFieldName2].saveValue == 'BD') {
        if (NotiArr.indexOf('0') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q1ToQ7);
        }
      }
      //傳統外幣(簡式) EX:一路勝傳統外幣
      if (this[dataFieldName1].saveValue == 'ACLPEU6') {
        if (NotiArr.indexOf('10') > -1) {
          display_14 = checkI_NOTI_YN(I_NOTI_Q2Q3Q5_Y);
        }
      }
      //壽險告知
      o['DISPLAY_14'] = {
        saveValue: display_14,
        displayValue: display_14,
        count1: 1,
        count2: 1
      };
      //健康險告知
      o['DISPLAY_15'] = {
        saveValue: display_15,
        displayValue: display_15,
        count1: 1,
        count2: 1
      };
      //癌症險告知
      o['DISPLAY_16'] = {
        saveValue: display_16,
        displayValue: display_16,
        count1: 1,
        count2: 1
      };
      //全民健康保險重大傷病範圍保險告知
      o['DISPLAY_17'] = {
        saveValue: display_17,
        displayValue: display_17,
        count1: 1,
        count2: 1
      };
      //傷害險告知
      o['DISPLAY_18'] = {
        saveValue: display_18,
        displayValue: display_18,
        count1: 1,
        count2: 1
      };
      //要保人豁免保險費附約告知
      o['DISPLAY_19'] = {
        saveValue: display_19,
        displayValue: display_19,
        count1: 1,
        count2: 1
      };
      //配偶告知
      o['DISPLAY_20'] = {
        saveValue: display_20,
        displayValue: display_20,
        count1: 1,
        count2: 1
      };
      //子女1告知
      o['DISPLAY_21'] = {
        saveValue: display_21,
        displayValue: display_21,
        count1: 1,
        count2: 1
      };
      //子女2告知 
      o['DISPLAY_22'] = {
        saveValue: display_22,
        displayValue: display_22,
        count1: 1,
        count2: 1
      };
      //告知問項1
      o['I_NOTI_Q1'] = {
        saveValue: this['I_NOTI_Q1'].saveValue,
        displayValue: I_NOTI_Q1,
        count1: 1,
        count2: 1
      };
      //告知問項2
      o['I_NOTI_Q2'] = {
        saveValue: this['I_NOTI_Q2'].saveValue,
        displayValue: I_NOTI_Q2,
        count1: 1,
        count2: 1
      };
      //告知問項3
      o['I_NOTI_Q3'] = {
        saveValue: this['I_NOTI_Q3'].saveValue,
        displayValue: I_NOTI_Q3,
        count1: 1,
        count2: 1
      };
      //告知問項4
      o['I_NOTI_Q4'] = {
        saveValue: this['I_NOTI_Q4'].saveValue,
        displayValue: I_NOTI_Q4,
        count1: 1,
        count2: 1
      };
      //告知問項5
      o['I_NOTI_Q5'] = {
        saveValue: this['I_NOTI_Q5'].saveValue,
        displayValue: I_NOTI_Q5,
        count1: 1,
        count2: 1
      };
      //告知問項6
      o['I_NOTI_Q6'] = {
        saveValue: this['I_NOTI_Q6'].saveValue,
        displayValue: I_NOTI_Q6,
        count1: 1,
        count2: 1
      };
      //告知問項7
      o['I_NOTI_Q7'] = {
        saveValue: this['I_NOTI_Q7'].saveValue,
        displayValue: I_NOTI_Q7,
        count1: 1,
        count2: 1
      };
    }
    /**
     * 將受益人關係其他，display轉成說明欄位
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function fmlyRenText(dataFieldName1Arr, dataFieldName2Arr) {
      for (var i = 0; i < dataFieldName1Arr.length; i++) {
        if (this[dataFieldName1Arr[i]].saveValue == '6') {
          o[dataFieldName1Arr[i]] = {
            saveValue: this[dataFieldName1Arr[i]].saveValue,
            displayValue: this[dataFieldName2Arr[i]].saveValue,
            count1: 1,
            count2: 1
          };
        }
      }
    }
    /**
     * 將受益人關係其他，display轉成說明欄位
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function ctryoText(dataFieldName1Arr, dataFieldName2Arr, dataFieldName3) {
      var strChain = '';
      if (dataFieldName1Arr.length != 0) {
        for (var i = 0; i < dataFieldName1Arr.length; i++) {
          if (this[dataFieldName1Arr[i]].saveValue != 'TWN' && this[dataFieldName1Arr[i]].saveValue != '') {
            var str = '';
            //姓名國籍:美國
            str = this[dataFieldName2Arr[i]].saveValue + '國籍:' + this[dataFieldName1Arr[i]].displayValue;
            //一列資料以上時(不抓第一筆)
            if (dataFieldName1Arr.length - 1 != i) {
              strChain += str + ',';
            }
            //最後一筆不用換行
            else if (dataFieldName1Arr.length - 1 == i) {
              strChain += str;
            }
          }
        }
      }
      o[dataFieldName3] = {
        saveValue: strChain,
        displayValue: strChain,
        count1: 1,
        count2: 1
      };
    }
    /**
     * 將受益人非直系說明，組成字串
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function descripText(dataFieldName1Arr, dataFieldName) {
      var strChain = '';
      for (var i = 0; i < dataFieldName1Arr.length; i++) {
        var str = '';
        str = '受益人' + (i + 1) + '原因:' + this[dataFieldName1Arr[i]].saveValue;
        if (this[dataFieldName1Arr[i]].saveValue != '') {
          if (dataFieldName1Arr.length - 1 != i) {
            strChain += str + ',';
          } else if (dataFieldName1Arr.length - 1 == i) {
            strChain += str;
          }
        }
      }
      o[dataFieldName] = {
        saveValue: strChain,
        displayValue: strChain,
        count1: 1,
        count2: 1
      };
    }
  
    /**
     * 將受益人非直系說明，組成字串
     * @param {*} dataFieldName 需要判斷的欄位名稱
     */
    function contractText() {
      var $table = mpsform.fieldName2McuMapAllPageVersion.E_TABLE02.$mcu;
      var str = "";
      var str2 = "";
      var a5Val = mpsFormUtil.transArrayToString(mpsform.fieldName2McuMapAllPageVersion.PASS_PAYMTH.$mcu.getMcuVal());
      var a6Val = '4';
      var a8Name = 'I_DETAILS_SICKCODE';
      var sickCode;
      $table.data('colModel').forEach(function(e) {
        if (e.field == a8Name) {
          sickCode = e.index;
        }
      });
      var tableVal = $table.getMcuVal();
      var $tr = $table.find('table>tr');
      var $th = $table.find('tr').find('th');
      $tr.each(function(index) {
        var trStr = "";
        var trVal = tableVal[index].cell;
        var trValRealLen = trVal.filter(function(element, ind) {
          return !!element && sickCode != ind;
        }).length;
        var count = 0;
        trVal.forEach(function(val, tdIndex) {
          var tdStr = "";
          if (!!val && sickCode != tdIndex) {
            count += 1;
            var title = $($th[tdIndex]).html();
            tdStr = title + ":" + val;
            if (trValRealLen != count) {
              trStr += tdStr + ",";
            } else {
              trStr += tdStr;
            }
          }
        });
        if (index == 1 && !!trStr) {
          str2 += "被保人:" + "\n";
          str2 += trStr + "\n";
        }
        //一列資料以上時(不抓第一筆)
        else if ($tr.length - 1 != index && index != 0) {
          str2 += trStr + "\n";
        }
        //最後一筆不用換行
        else if ($tr.length - 1 == index && index != 0) {
          str2 += trStr;
        }
        //第一列資料
        else if (index == 0) {
          str += trStr;
        }
  
      });
      if (!!mpsform.fieldName2McuMapAllPageVersion.E_TABLE04) {
        var $table2 = mpsform.fieldName2McuMapAllPageVersion.E_TABLE04.$mcu;
        var tableVal2 = $table2.getMcuVal();
        var $tr2 = $table2.find('table>tr');
        var $th2 = $table2.find('tr').find('th');
        $tr2.each(function(index) {
          var trStr = "";
          var trVal = tableVal2[index].cell;
          var trValRealLen = trVal.filter(function(element, ind) {
            return !!element && sickCode != ind;
          }).length;
          var count = 0;
          trVal.forEach(function(val, tdIndex) {
            var tdStr = "";
            if (!!val && sickCode != tdIndex) {
              count += 1;
              var title = $($th2[tdIndex]).html();
              tdStr = title + ":" + val;
              if (trValRealLen != count) {
                trStr += tdStr + ",";
              } else {
                trStr += tdStr;
              }
            }
          });
          if (index == 0 && !!trStr) {
            str2 += " " + "\n";
            str2 += "要保人:" + "\n";
            str2 += trStr + "\n";
          }
          //一列資料以上時(不抓第一筆)
          else if ($tr2.length - 1 != index) {
            str2 += trStr + "\n";
          }
          //最後一筆不用換行
          else if ($tr2.length - 1 == index) {
            str2 += trStr;
          }
          //第一列資料
          else if (index == 0) {
            str += trStr;
          }
  
        });
      }
      o['I_HEALTH_RECORD'] = {
        saveValue: str,
        displayValue: str,
        count1: 1,
        count2: 1
      };
      if (!!this['I_DETAILS_DETAIL_P']) {
        o['I_DETAILS_DETAIL_P'] = {
          saveValue: str2,
          displayValue: str2,
          count1: 1,
          count2: 1
        };
      }
      //有病歷第2筆 或 受益人分配方式選其他要出現契變書
      if ($tr.length > 1 || a5Val == a6Val) {
        o['DISPLAY_12'] = {
          saveValue: 'Y',
          displayValue: 'Y',
          count1: 1,
          count2: 1
        };
      } else {
        o['DISPLAY_12'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
  
    }
    /**
     * 依據A1被保險人要求欄位為A2，或是A3被保險人要求欄位是否為A2且A4附約表格內的A5附約名稱是否有豁免附約，來判斷A6欄位值
     * @param {mpsObject} field field 
     * @param {Object} rule rule
     * {參數1}-被保險人要求欄位，例如被保險人營業性質
     * {參數2}-判斷值
     * {參數3}-要保險人要求欄位，例如要保人營業性質
     * {參數4}-附約表格
     * {參數5}-附約表格內的附約名稱
     * {參數6}-套印判斷欄位，Y則套印否則為N
     */
    function InsurqueText(dataFieldName1, a2Val, dataFieldName3, dataFieldName4, dataFieldName5, dataFieldName6) {
      var val = mpsFormUtil.transArrayToString(a2Val);
      var printVal = 'N';
  
      if (this[dataFieldName1].saveValue == val) {
        printVal = 'Y';
      }
      if (!!mpsform.fieldName2McuMapAllPageVersion[dataFieldName4] && printVal != 'Y') {
        var grid = mpsform.fieldName2McuMapAllPageVersion[dataFieldName4].$mcu;
        var gridName = dataFieldName5;
        var exemption = false;
        grid.find('table>tr').each(function() {
          var gridField = $(this).find('div[data-field-name=' + gridName + ']');
          if (!!gridField.getMcuVal()) {
            exemption = mpsform.app.page.contracts[gridField.getMcuVal()].exemption != 'N' ? true : exemption;
            if (exemption) {
              return false;
            }
          }
        });
        printVal = exemption && this[dataFieldName3].saveValue == val ? 'Y' : printVal;
      }
      o[dataFieldName6] = {
        saveValue: printVal,
        displayValue: printVal,
        count1: 1,
        count2: 1
      };
    }
  
    /**
     * 依據A1被保險人要求欄位不為A2，或是A3被保險人要求欄位不為A2且A4附約表格內的A5附約名稱是否有豁免附約，來判斷A6欄位值
     * @param {mpsObject} field field 
     * @param {Object} rule rule
     * {參數1}-被保險人要求欄位，例如被保險人營業性質
     * {參數2}-判斷值
     * {參數3}-要保險人要求欄位，例如要保人營業性質
     * {參數4}-附約表格
     * {參數5}-附約表格內的附約名稱
     * {參數6}-套印判斷欄位，Y則套印否則為N
     */
    function ForeignqueText(dataFieldName1, a2Val, dataFieldName3, dataFieldName4, dataFieldName5, dataFieldName6) {
      var val = mpsFormUtil.transArrayToString(a2Val);
      var printVal = 'N';
  
      if (this[dataFieldName1].saveValue != val) {
        printVal = 'Y';
      }
      if (!!mpsform.fieldName2McuMapAllPageVersion[dataFieldName4] && printVal != 'Y') {
        var grid = mpsform.fieldName2McuMapAllPageVersion[dataFieldName4].$mcu;
        var gridName = dataFieldName5;
        var exemption = false;
        grid.find('table>tr').each(function() {
          var gridField = $(this).find('div[data-field-name=' + gridName + ']');
          if (!!gridField.getMcuVal()) {
            exemption = mpsform.app.page.contracts[gridField.getMcuVal()].exemption != 'N' ? true : exemption;
            if (exemption) {
              return false;
            }
          }
        });
        printVal = exemption && this[dataFieldName3].saveValue == val ? 'Y' : printVal;
      }
      o[dataFieldName6] = {
        saveValue: printVal,
        displayValue: printVal,
        count1: 1,
        count2: 1
      };
    }
    /**
     * 取得A1表格內的A2基金名稱、A3表格內的A4基金名稱，判斷A5欄位值
     * @param {mpsObject} field field 
     * @param {Object} rule rule
     * {參數1}-表格
     * {參數2}-基金名稱欄位
     * {參數3}-表格
     * {參數4}-基金名稱欄位
     * {參數5}-欲判斷欄位
     */
    function OverseasCash(dataFieldName1, dataFieldName2, dataFieldName3, dataFieldName4, dataFieldName5) {
      var check = 'N';
      if (!!mpsform.fieldName2McuMapAllPageVersion[dataFieldName1] || !!mpsform.fieldName2McuMapAllPageVersion[dataFieldName3]) {
        var $grid1 = mpsform.fieldName2McuMapAllPageVersion[dataFieldName1].$mcu;
        var gridVal_1 = $grid1.getMcuVal();
        var grid1Filed = dataFieldName2;
        var grid1FiledIx = $grid1.find(template('thead>tr [data-field-name=${field}]', {
          field: grid1Filed
        })).index();
        var $grid2 = mpsform.fieldName2McuMapAllPageVersion[dataFieldName3].$mcu;
        var gridVal_2 = $grid2.getMcuVal();
        var grid2Filed = dataFieldName4;
        var grid2FiledIx = $grid2.find(template('thead>tr [data-field-name=${field}]', {
          field: grid2Filed
        })).index();
        var nameArr = gridVal_1.map(function(e) {
          if (!!e.cell[grid1FiledIx]) {
            return e.cell[grid1FiledIx].split('-')[0];
          }
        });
        var nameArr2 = gridVal_2.map(function(e) {
          if (!!e.cell[grid2FiledIx]) {
            return e.cell[grid2FiledIx].split('-')[0];
          }
          return;
        });
        var allFund = nameArr.concat(nameArr2).reduce(function(arr, ele, i) {
          if (!!ele && arr.every(function(e) {
              return e != ele
            })) {
            arr.push(ele);
          }
          return arr;
        }, []);
        check = allFund.some(function(e) {
          return fundInfMap[e].fundcurr != 'NT$'
        }) ? 'Y' : 'N';
      }
      o[dataFieldName5] = {
        saveValue: check,
        displayValue: check,
        count1: 1,
        count2: 1
      };
    }
    var o = null;
    return function(eposKeyinData) {
      o = {};
      // 要保人_國籍
      checkNationality.call(eposKeyinData, 'A_CTRYORIG01');
      // 要保人_戶籍_國別
      checkNationality.call(eposKeyinData, 'A_CTRYORIG03');
      // 要保人_住所_國別
      checkNationality.call(eposKeyinData, 'A_CON_CTRYORIG03');
  
      // 被保人_國籍
      checkNationality.call(eposKeyinData, 'I_CTRYORIG01');
      // 被保人_國籍
      checkNationality.call(eposKeyinData, 'I_CTRYORIG03');
  
      // 主約(一)_計價幣別
      currencyForPrint.call(eposKeyinData, 'M1_CURRNCY');
  
      // 主被保險人同要保人
      clearICHKFLAG_OTHER.call(eposKeyinData, 'I_RELA_CODE');
  
      // 要保人_性別
      sexText.call(eposKeyinData, 'A_CLTSEX');
      // 主被保險人_性別
      sexText.call(eposKeyinData, 'I_CLTSEX');
  
      // 主約(一)保險金額
      exchangeSumins.call(eposKeyinData, 'M1_SUMINS', 'M1_PROD_UNIT', 'M1_PRO_CODE');
  
      // CRS個人_稅籍編號狀態
      taxNoStatus.call(eposKeyinData, 'E_TABLE08', 'CRS_P_TAXNUMBER_TYPE');
      // CRS實體_無法提供稅籍編號理由
      // taxNoStatus.call(eposKeyinData, 'E_TABLE08', 'CRS_ETY_NOTAXNUMBER_A');
      // CRS具控制權人_稅籍編號狀態
      // taxNoStatus.call(eposKeyinData, 'E_TABLE08', 'CRS_CTROL_TAXNUMBER_TYPE');
  
  
  
  
      // 投資組合_基金名稱
      // 處理E_TABLE01投資組合內基金名稱 FUND_TABLE2
      checkFundName.call(eposKeyinData, 'E_TABLE01', 'FUND_TABLE2');
      // 靈活配置-轉出投資標的
      checkFundName.call(eposKeyinData, 'E_TABLE06', 'TRANSFOUT_FUND_NAME');
      // 靈活配置-轉入投資標的
      checkFundName.call(eposKeyinData, 'E_TABLE07', 'TRANSFINTO__FUND_NAME');
  
  
      checkI_Nationality.call(eposKeyinData, 'PASS_BEN1_CTRYORIG01');
      checkI_Nationality.call(eposKeyinData, 'PASS_BEN2_CTRYORIG01');
      checkI_Nationality.call(eposKeyinData, 'PASS_BEN3_CTRYORIG01');
      var exemptionYN = checkExemption.call(eposKeyinData, 'TABLE11', 'R_PRO_CODE', 'M1_PRO_CODE');
      //告知事項套印轉換(主約、通路、商品種類)
      checkI_NOTI.call(eposKeyinData, 'M1_PRO_CODE', 'AGYTYPE', this.form.app.page.contracts[eposKeyinData['M1_PRO_CODE'].saveValue].prodType, exemptionYN);
      // 判斷被保險人是否同要保人
      // 透過 I_ANBCCD 的值，判斷重要事項告知書欄位是否填值
      // IMPOR_NOTI05  被保險人年齡大於等於70歲
      var ageFieldName = '';
      if (eposKeyinData.I_RELA_CODE.saveValue == 1) {
        ageFieldName = 'A_ANBCCD';
      } else {
        ageFieldName = 'I_ANBCCD';
      }
  
      if (eposKeyinData[ageFieldName].saveValue >= 70) {
        o['IMPOR_NOTI05'] = {
          saveValue: 'Y',
          displayValue: 'Y',
          count1: 1,
          count2: 1
        };
      } else {
        o['IMPOR_NOTI05'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
  
  
      // 轉帳授權書，首期授權人身份其他說明，當不為要被保人及指定受益人時需顯示 (新增擷取括號內文字)
      if (eposKeyinData.FIRST_AUTHORIZER_TYPE.saveValue != 0 &&
        eposKeyinData.FIRST_AUTHORIZER_TYPE.saveValue != 1 &&
        eposKeyinData.FIRST_AUTHORIZER_TYPE.saveValue != 2) {
  
        o['FIRST_AUTHORIZER_TYPE_OTHER'] = {
          saveValue: eposKeyinData.FIRST_AUTHORIZER_TYPE.saveValue,
          displayValue: eposKeyinData.FIRST_AUTHORIZER_TYPE.displayValue.slice(6, -1),
          count1: 1,
          count2: 1
        };
      }
  
      // 轉帳授權書，續期授權人身份其他說明，當不為要被保人及指定受益人時需顯示 (新增擷取括號內文字)
      if (eposKeyinData.RENEW_AUTHORIZER_TYPE.saveValue != 0 &&
        eposKeyinData.RENEW_AUTHORIZER_TYPE.saveValue != 1 &&
        eposKeyinData.RENEW_AUTHORIZER_TYPE.saveValue != 2) {
  
        o['RENEW_AUTHORIZER_TYPE_OTHER'] = {
          saveValue: eposKeyinData.RENEW_AUTHORIZER_TYPE.saveValue,
          displayValue: eposKeyinData.RENEW_AUTHORIZER_TYPE.displayValue.slice(6, -1),
          count1: 1,
          count2: 1
        };
      }
  
      // 判斷 CNA 相關
      var ua = JSON.parse(new __PcaLife__().getUserAuthority()); //取得USER使用模組
      var self = this; //附約有使用，請勿刪除此行
      // 若可使用CNA才繼續
      if (!mpsform.app.isTest) {
        if (ua.modules.some(function(u) {
            return u.moduleId === 'M01'
          }) && this.form.app.page.illuMappKeyinData.cnaData && this.form.app.page.illuMappKeyinData.cnaData.purposeID) {
          var CNA_PRO_TYPE = this.form.app.page.illuMappKeyinData.cnaData.purposeID.map(function(i) {
            return purposeMap[i].purposeInsure;
          }).join(',').split(',').reduce(
            function(a, b) {
              if (a.indexOf(b) === -1) {
                a.push(b);
              }
              return a;
            }, []).reduce(function(a, b) {
            if (!self.form.app.page.contracts[b]) {
              return a;
            }
            var license = self.form.app.page.contracts[b].license.split(',');
            license.forEach(function(ll) {
              if (a.indexOf(ll) === -1) {
                a.push(ll);
              }
            });
            return a;
          }, []).join(',');
  
          o['CNA_PRO_TYPE'] = {
            saveValue: CNA_PRO_TYPE,
            displayValue: CNA_PRO_TYPE,
            count1: 1,
            count2: 1
          };
        }
      }
  
      //修改審閱期聲明
      if (eposKeyinData.hasOwnProperty('COM_PRO_NAME')) {
        var preview = eposKeyinData['COM_PRO_NAME'].saveValue.split('、');
  
        var comProNameString = "";
        var likeGridArr = [];
        for (var i = 0; i < preview.length; i++) {
  
          var value = preview[i];
          if (i == 0) {
            var obj = {};
            obj['DISPLAY_23'] = {
              saveValue: value,
              displayValue: value,
              count1: 1,
              count2: 1
            };
            likeGridArr.push(obj);
          } else {
            if (comProNameString.length > 0) {
              comProNameString = comProNameString.concat(",");
            }
            comProNameString = comProNameString + value;
          }
  
  
          if (i + 1 == preview.length) {
            var obj = {};
            obj['DISPLAY_23'] = {
              saveValue: comProNameString,
              displayValue: comProNameString,
              count1: 1,
              count2: 2
            };
            likeGridArr.push(obj);
          }
  
        }
  
        o['DISPLAY_24'] = likeGridArr;
        o.grid = eposKeyinData['grid'] + 'DISPLAY_24,';
      }
  
      //保費給後端使用的欄位轉換
      var m1_prodCode = eposKeyinData.M1_PRO_CODE.saveValue;
      var m1_productData = this.form.app.page.contracts[m1_prodCode];
      var m1_tmpPrem = this.form.app.tmpPrem;
      var totalDisPrem = 0;
      if (this.form.app.tmpPrem.hasOwnProperty("M1_PRO_CODE")) {
        var m1_disPrem = m1_tmpPrem['M1_PRO_CODE'].disPrem;
        Object.keys(m1_tmpPrem).forEach(function(t) {
          totalDisPrem = totalDisPrem + this[t].disPrem;
        }, m1_tmpPrem)
        o['M1_PROD_UNIT'] = {
          saveValue: m1_productData.unit,
          displayValue: m1_productData.unit,
          count1: 1,
          count2: 1
        };
        o['M1_PREMIUM'] = {
          saveValue: parseInt(totalDisPrem).toString(),
          displayValue: parseInt(totalDisPrem).toString(), //到時需修改為僅出現主約一
          count1: 1,
          count2: 1
        };
        o['TOTLPREM'] = {
          saveValue: parseInt(totalDisPrem, 10).toString(),
          displayValue: parseInt(totalDisPrem, 10).toLocaleString(),
          count1: 1,
          count2: 1
        };
        //附約保費
        if (eposKeyinData.hasOwnProperty('TABLE11')) {
          eposKeyinData['TABLE11'].forEach(function(oo) {
            if (oo && oo['R_PRO_CODE'].saveValue) {
              var subProductData = self.form.app.page.contracts[oo['R_PRO_CODE'].saveValue];
              var count2 = oo['R_PRO_CODE'].count2;
              var subProdR_FMLYRELN02Val = oo['R_FMLYRELN02'].saveValue;
              var subProdOwnerName = '';
              switch (subProdR_FMLYRELN02Val) {
                case '1':
                  subProdOwnerName = 'insuredOwner';
                  break;
                case '2':
                  subProdOwnerName = 'spouse';
                  break;
                case '4':
                  subProdOwnerName = 'policyHolder';
                  break;
                default:
                  return false;
              };
              oo['R_PROD_UNIT'] = {
                fieldName: 'R_PROD_UNIT',
                saveValue: subProductData.unit,
                displayValue: subProductData.unit,
                count1: 1,
                count2: count2
              };
              oo['R_PREMIUM'] = {
                fieldName: 'R_PREMIUM',
                saveValue: parseInt(totalDisPrem - m1_disPrem).toString(),
                displayValue: parseInt(totalDisPrem - m1_disPrem).toString(),
                count1: 1,
                count2: count2
              };
              oo['R_SURNAME'] = {
                fieldName: 'R_SURNAME',
                saveValue: self.form.app.page[subProdOwnerName]['name'],
                displayValue: self.form.app.page[subProdOwnerName]['name'],
                count1: 1,
                count2: count2
              };
              oo['R_LIFEIDNO'] = {
                fieldName: 'R_LIFEIDNO',
                saveValue: self.form.app.page[subProdOwnerName]['id'].toUpperCase(),
                displayValue: self.form.app.page[subProdOwnerName]['id'],
                count1: 1,
                count2: count2
              };
              if (!!oo['R_SUMINS'].saveValue && !!subProductData.unit) {
                var displayMoney = parseInt(subProductData.unit, 10) * parseInt(oo['R_SUMINS'].saveValue, 10);
                oo['DISPLAY_27'] = {
                  fieldName: 'DISPLAY_27',
                  saveValue: displayMoney.toLocaleString(),
                  displayValue: displayMoney.toLocaleString(),
                  count1: 1,
                  count2: count2
                }
              }
            }
          });
        };
      }
  
      //修改集彙表格內的身份證大小寫
      //   if (eposKeyinData.hasOwnProperty('E_TABLE03')) {
      //     o['E_TABLE03'] = eposKeyinData['E_TABLE03'].map(function(e) {
      //       e['CAMPAIGN_I_LIFEIDNO'] = {
      //         fieldName: 'CAMPAIGN_I_LIFEIDNO',
      //         saveValue: e['CAMPAIGN_I_LIFEIDNO'].saveValue,
      //         displayValue: e['CAMPAIGN_I_LIFEIDNO'].displayValue.toUpperCase(),
      //         count1: 1,
      //         count2: e['CAMPAIGN_I_LIFEIDNO'].count2
      //       }
      //       return e
      //     });
      //   }
      //關係選單Arr
      var fmlrArr = ['PASS_BEN1_FMLYRELN', 'PASS_BEN2_FMLYRELN', 'PASS_BEN3_FMLYRELN'];
      //關係其說明Arr
      var fmlrOthArr = ['PASS_BEN1_FMLYRELN_OTHER', 'PASS_BEN2_FMLYRELN_OTHER', 'PASS_BEN3_FMLYRELN_OTHER'];
      //身故受益人關係其他套印用(轉換)
      fmlyRenText.call(eposKeyinData, fmlrArr, fmlrOthArr);
      //身故受益人國籍Arr
      var ctryoArr = ['PASS_BEN1_CTRYORIG01', 'PASS_BEN2_CTRYORIG01', 'PASS_BEN3_CTRYORIG01'];
      //身故受益人姓名Arr
      var surNameArr = ['PASS_BEN1_SURNAME', 'PASS_BEN2_SURNAME', 'PASS_BEN3_SURNAME'];
      //組合套印國籍其他欄位
      ctryoText.call(eposKeyinData, ctryoArr, surNameArr, 'DISPLAY_29');
      var descrip = ['PASS_BEN1_DESCRIP', 'PASS_BEN2_DESCRIP', 'PASS_BEN3_DESCRIP'];
      descripText.call(eposKeyinData, descrip, 'DISPLAY_30');
      //均分的時候，不要套印出比例
      if (eposKeyinData.PASS_PAYMTH.saveValue == '01') {
        o['PASS_BEN1_NEWBNYPC'] = {
          saveValue: eposKeyinData.PASS_BEN1_NEWBNYPC.saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
        o['PASS_BEN2_NEWBNYPC'] = {
          saveValue: eposKeyinData.PASS_BEN2_NEWBNYPC.saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
        o['PASS_BEN3_NEWBNYPC'] = {
          saveValue: eposKeyinData.PASS_BEN3_NEWBNYPC.saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //套印被保險人、要保人病歷，契變書
      contractText.call(eposKeyinData);
      //主被保人營業性質，去掉代碼
      if (!!eposKeyinData.I_BUSS_ITEM.saveValue) {
        o['VIEW46'] = {
          saveValue: occuTypeMap[eposKeyinData.I_BUSS_ITEM.saveValue],
          displayValue: occuTypeMap[eposKeyinData.I_BUSS_ITEM.saveValue],
          count1: 1,
          count2: 1
        };
      } else {
        o['VIEW46'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //要保人營業性質，去掉代碼
      if (!!eposKeyinData.A_BUSS_ITEM.saveValue) {
        o['VIEW44'] = {
          saveValue: occuTypeMap[eposKeyinData.A_BUSS_ITEM.saveValue],
          displayValue: occuTypeMap[eposKeyinData.A_BUSS_ITEM.saveValue],
          count1: 1,
          count2: 1
        };
      } else {
        o['VIEW44'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //要保人工作內容，去掉代碼
      if (!!eposKeyinData.A_WORK_CONTENT.saveValue) {
        o['VIEW43'] = {
          saveValue: occuInf[eposKeyinData.A_WORK_CONTENT.saveValue].occuName,
          displayValue: occuInf[eposKeyinData.A_WORK_CONTENT.saveValue].occuName,
          count1: 1,
          count2: 1
        };
      } else {
        o['VIEW43'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //主被保人工作內容，去掉代碼
      if (!!eposKeyinData.I_WORK_CONTENT.saveValue) {
        o['VIEW45'] = {
          saveValue: occuInf[eposKeyinData.I_WORK_CONTENT.saveValue].occuName,
          displayValue: occuInf[eposKeyinData.I_WORK_CONTENT.saveValue].occuName,
          count1: 1,
          count2: 1
        };
      } else {
        o['VIEW45'] = {
          saveValue: '',
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //依據個資欄位是否勾選，以及業務員通路組織屬性判斷是否套印個人資料之蒐集、處理及利用同意書
      var print = 'N';
      if (!!eposKeyinData.DOC2_REVIEW.saveValue && mpsform.app.page.agentInfo.channel == 'BR') {
        print = 'Y';
      }
      o['DISPLAY_05'] = {
        saveValue: print,
        displayValue: print,
        count1: 1,
        count2: 1
      };
      //依據被保險人營業性質是否為軍人(1900)，或是要保人營業性質是否為軍人且投保豁免附約，來判斷是否套印軍人職業告知問卷(有附約的要保書)
      InsurqueText.call(eposKeyinData, 'I_BUSS_ITEM', '1900', 'A_BUSS_ITEM', 'TABLE11', 'R_PRO_CODE', 'DISPLAY_02');
      //依據被保險人職業代碼是否為外籍新娘／大陸新娘（98010060），或是要保人職業代碼是否為外籍新娘／大陸新娘且投保豁免附約，來判斷是否外籍配偶之投保問卷(有附約的要保書)
      InsurqueText.call(eposKeyinData, 'I_OCCPCDEN', '98010060', 'A_OCCPCDEN', 'TABLE11', 'R_PRO_CODE', 'DISPLAY_03');
      //依據被保人的國籍不為中華民國，或是要保人國籍不為中華民國且投保豁免附約，來判斷是否套印外籍人士來台工作之投保問卷(有附約的要保書)
      ForeignqueText.call(eposKeyinData, 'I_CTRYORIG01', 'TWN', 'A_CTRYORIG01', 'TABLE11', 'R_PRO_CODE', 'DISPLAY_04');
      //判斷是否套印書面分析報告
      var ua = JSON.parse(new __PcaLife__().getUserAuthority()); //取得模組
      var CNAvalue = ua.modules.some(function(u) {
        return u.moduleId === 'M01';
      }) ? 'Y' : 'N';
      o['DISPLAY_09'] = {
        saveValue: CNAvalue,
        displayValue: CNAvalue,
        count1: 1,
        count2: 1
      };
      //依據主契約商品是否具有審閱期，並判斷通路代碼，決定是否套印審閱期聲明
      var prod = [];
      prod.push(eposKeyinData.M1_PRO_CODE.saveValue);
      var review = prod.some(function(e) {
        return mpsform.app.page.contracts[e].reviewPeriod == 'Y';
      });
      review = review && mpsform.app.page.agentInfo.agycode != '09AA1';
      o['DISPLAY_01'] = {
        saveValue: review ? 'Y' : 'N',
        displayValue: review ? 'Y' : 'N',
        count1: 1,
        count2: 1
      };
      //要保人_與主被保險人關係_其他說明(A_FMLYRELN02_OTHER)設值
      var WorkContent = mpsform.fieldName2McuMapAllPageVersion.A_FMLYRELN02.$mcu;
      var currentValue = eposKeyinData.A_FMLYRELN02.saveValue;
      if (!!currentValue) {
        var arr = ['4', '11', '12', '13', 'A', '9', '8'];
        var mapResult = arr.indexOf(currentValue);
        if (mapResult > -1) {
          var b = WorkContent.find('input').filter(
            function() {
              return ($(this).val() == currentValue);
            }
          );
          o['A_FMLYRELN02_OTHER'] = {
            saveValue: eposKeyinData.A_FMLYRELN02_OTHER.saveValue,
            displayValue: b.data('text'),
            count1: 1,
            count2: 1
          };
        }
        if (currentValue == 6) {
          o['A_FMLYRELN02_OTHER'] = {
            saveValue: eposKeyinData.A_FMLYRELN02_OTHER.saveValue,
            displayValue: eposKeyinData.A_FMLYRELN02_OTHER.displayValue,
            count1: 1,
            count2: 1
          };
        }
      } else {
        o['A_FMLYRELN02_OTHER'] = {
          saveValue: eposKeyinData.A_FMLYRELN02_OTHER.saveValue,
          displayValue: '',
          count1: 1,
          count2: 1
        };
      }
      //CRS表格內國籍轉文字
      if (eposKeyinData.hasOwnProperty('E_TABLE08')) {
        o['E_TABLE08'] = eposKeyinData['E_TABLE08'].map(function(e) {
          var cty = sysMenu['10009'].find(function(c) {
            return c.CodeNo == e['CRS_P_TAX_COUNTRY_1'].saveValue
          });
          e['CRS_P_TAX_COUNTRY_1'] = {
            fieldName: 'CRS_P_TAX_COUNTRY_1',
            saveValue: e['CRS_P_TAX_COUNTRY_1'].saveValue,
            displayValue: !!e['CRS_P_TAX_COUNTRY_1'].saveValue ? cty.CodeName : '',
            count1: 1,
            count2: e['CRS_P_TAX_COUNTRY_1'].count2
          }
          return e
        });
      }
  
  
      /*  協助撰寫客戶聲明書的出現判斷：當要保人國籍為非中華民?
       *  （A_CTRYORIG01≠TWN）時 或 要保人的是否在國外工作為是（A_WORKING_OVERSEAS=Y）時，出現。DISPLAY_06=Y
       *    2019/01/08
       */
      var display_06 = false;
  
      if (eposKeyinData.A_CTRYORIG01) {
        if (eposKeyinData.A_CTRYORIG01.saveValue != "TWN") {
          display_06 = true;
        }
      }
      if (eposKeyinData.A_WORKING_OVERSEAS) {
        if (eposKeyinData.A_WORKING_OVERSEAS.saveValue == "Y") {
          display_06 = true;
        }
      }
      if (display_06) {
        o['DISPLAY_06'] = {
          saveValue: 'Y',
          displayValue: 'Y',
          count1: 1,
          count2: 1
        }
      } else {
        o['DISPLAY_06'] = {
          saveValue: 'N',
          displayValue: 'N',
          count1: 1,
          count2: 1
        }
      }
  
  
      /*  契變書，增加是否有兼職的套印區塊。
       *  且根據要保人或被保人的‘是否有兼職’為‘是’時，將兼職各欄位填寫結果套印於契變書相應位置。
       *  套印規則和現行職業套印相同。
       *     當分配方式為其他時（PASS_PAYMTH＝4）或 
       *  告知事項的疾病表格擁有第二筆疾病資料（I_DETAILS_DETAIL_P有值）時 或 
       *  要保人是否有兼職為有（A_PART_TIME＝Y）時 或被保人是否有兼職為有（I_PART_TIME＝Y）時，出現。
       *  ->契變書(DISPLAY_12)＝Y
       *  2019/01/10
       */
      var display_12 = false;
  
      if (eposKeyinData.PASS_PAYMTH) {
        if (eposKeyinData.PASS_PAYMTH.saveValue == "4") {
          display_12 = true;
        }
      }
  
      if (eposKeyinData.I_DETAILS_DETAIL_P) {
        if (eposKeyinData.I_DETAILS_DETAIL_P.saveValue.length > 0) {
          display_12 = true;
        }
      }
  
      if (eposKeyinData.A_PART_TIME) {
        if (eposKeyinData.A_PART_TIME.saveValue == "Y") {
          display_12 = true;
        }
      }
  
      if (eposKeyinData.I_PART_TIME) {
        if (eposKeyinData.I_PART_TIME.saveValue == "Y") {
          display_12 = true;
        }
      }
  
      if (display_12) {
        o['DISPLAY_12'] = {
          saveValue: 'Y',
          displayValue: 'Y',
          count1: 1,
          count2: 1
        }
      }
  
  
      /*  問題 #1453 商品適用FATCA邏輯
       *   商品適用FATCA且要保人為自然人時， DISPLAY_47 = Y
       *   商品適用FATCA且要保人為法人時， DISPLAY_48 = Y
       *   1 : 自然人
       *   2 : 法人
       *   2019/01/22
       */
      if (eposKeyinData.hasOwnProperty('A_CLTTYPE') && this.form.app.page.contracts[eposKeyinData['M1_PRO_CODE'].saveValue].isuseFatca == 'Y') {
  
        if (eposKeyinData.A_CLTTYPE.saveValue == '1') {
          o['DISPLAY_47'] = {
            saveValue: 'Y',
            displayValue: 'Y',
            count1: 1,
            count2: 1
          }
  
          o['DISPLAY_48'] = {
            saveValue: 'N',
            displayValue: 'N',
            count1: 1,
            count2: 1
          }
        } else if (eposKeyinData.A_CLTTYPE.saveValue == '2') {
          o['DISPLAY_48'] = {
            saveValue: 'Y',
            displayValue: 'Y',
            count1: 1,
            count2: 1
          }
  
          o['DISPLAY_47'] = {
            saveValue: 'N',
            displayValue: 'N',
            count1: 1,
            count2: 1
          }
        } else {
          o['DISPLAY_47'] = {
            saveValue: 'N',
            displayValue: 'N',
            count1: 1,
            count2: 1
          }
  
          o['DISPLAY_48'] = {
            saveValue: 'N',
            displayValue: 'N',
            count1: 1,
            count2: 1
          }
        }
  
      }
      //確保通路屬性及通路代碼一定存在，以避免無法套印要保書
      o['AGYCODE'] = {
        saveValue: mpsform.app.page.agentInfo.agencyno,
        displayValue: mpsform.app.page.agentInfo.agencyno,
        count1: 1,
        count2: 1
      }
      o['AGYTYPE'] = {
        saveValue: mpsform.app.page.agentInfo.channel,
        displayValue: mpsform.app.page.agentInfo.channel,
        count1: 1,
        count2: 1
      }
  
      //判斷投資標的表格及可轉入基金表格是否有外幣基金
      OverseasCash.call(eposKeyinData, 'E_TABLE01', 'FUND_TABLE2', 'E_TABLE07', 'TRANSFINTO__FUND_NAME', 'DISPLAY_13');
      return Object.assign(eposKeyinData, o);
    }
  })();