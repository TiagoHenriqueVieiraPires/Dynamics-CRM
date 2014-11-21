/*****************************************************************/
/*          Códigos Java Scritp's Entidade Unidade de Negócio    */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 06/06/2014                                    */
/*          Versão: 1.0                                          */
/*****************************************************************/

function Onchange_address1_telephone1() {
    maskPhone("address1_telephone1");
}

function Onchange_address1_telephone2() {
    maskPhone("address1_telephone2");
}

function Onchange_address1_postalcode() {
    if (Xrm.Page.getAttribute('address1_postalcode').getValue() == null) {
        Xrm.Page.getAttribute('address1_name').setValue(null);
        Xrm.Page.getAttribute('address1_line3').setValue(null);
        Xrm.Page.getAttribute('new_cidadeid').setValue(null);
        Xrm.Page.getAttribute('new_estadoid').setValue(null);
        Xrm.Page.getAttribute('new_paisid').setValue(null);
        StatusEndereco();
    } else {
        BuscaCepMrvLog("address1_postalcode", ProcessaRetornoCEP, ProcessaErroCep);
    }
}

function Onchange_new_cnpj() {
    maskValidCnpj("new_cnpj");
}

function OnLoad_businesUnit() {
    StatusEndereco();
}

function OnSave_businesUnit() {
    forceSave("new_salvar");
    EnabledAllRecording();
}

function ProcessaRetornoCEP(data) {
    if (data != null) {
        if (data.Sucesso) {
            //Logradouro
            if (data.Logradouro !== "") { Xrm.Page.getAttribute('address1_name').setValue(data.Logradouro); } else { Xrm.Page.getAttribute('address1_name').setValue(null); }
            //Bairro
            if (data.Bairro !== "") { Xrm.Page.getAttribute('address1_line3').setValue(data.Bairro); } else { Xrm.Page.getAttribute('address1_line3').setValue(null); }
            var idPais = "";
            var idEsatdo = "";
            //Estado
            if (data.UF !== "") {
                var entityRetrive = getEntityNodesDouble('new_estado', 'new_sigla', data.UF, "statecode", "Active");
                if (entityRetrive.length != 0) {
                    var entityNodeRetrive = entityRetrive[0];
                    var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                    name = name.text;
                    idEsatdo = entityNodeRetrive.selectSingleNode("q1:new_estadoid");
                    idEsatdo = idEsatdo.text;
                    var lookupData = new Array();
                    var lookupItem = new Object();
                    lookupItem.id = idEsatdo;
                    lookupItem.typename = "new_estado";
                    lookupItem.name = name;
                    lookupData[0] = lookupItem;
                    Xrm.Page.getAttribute("new_estadoid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_estadoid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_estadoid').setValue(null); }
            //País
            if (data.Pais !== "") {
                var entityRetrive = getEntityNodesDouble('new_pais', 'new_name', data.Pais, "statecode", "Active");
                if (entityRetrive.length != 0) {
                    var entityNodeRetrive = entityRetrive[0];
                    var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                    name = name.text;
                    idPais = entityNodeRetrive.selectSingleNode("q1:new_paisid");
                    idPais = idPais.text;
                    var lookupData = new Array();
                    var lookupItem = new Object();
                    lookupItem.id = idPais;
                    lookupItem.typename = "new_pais";
                    lookupItem.name = name;
                    lookupData[0] = lookupItem;
                    Xrm.Page.getAttribute("new_paisid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_paisid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_paisid').setValue(null); }
            //Cidade
            if (data.Cidade !== "") {
                var entityRetrive = getEntityNodesTree('new_cidades', 'new_name', data.Cidade, "statecode", "Active", "new_estadoid", idEsatdo);
                if (entityRetrive.length != 0) {
                    var entityNodeRetrive = entityRetrive[0];
                    var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                    name = name.text;
                    var idCidade = entityNodeRetrive.selectSingleNode("q1:new_cidadesid");
                    idCidade = idCidade.text;
                    var lookupData = new Array();
                    var lookupItem = new Object();
                    lookupItem.id = idCidade;
                    lookupItem.typename = "new_cidades";
                    lookupItem.name = name;
                    lookupData[0] = lookupItem;
                    Xrm.Page.getAttribute("new_cidadeid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_cidadeid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_cidadeid').setValue(null); }
        } else { ProcessaErroCep(); }
    }
    StatusEndereco();
    maskValidCep("address1_postalcode");
}

function ProcessaErroCep() {
    alert("CEP não encontrado. Favor digitar o endereço.");
    Xrm.Page.getAttribute('address1_name').setValue(null);
    Xrm.Page.getAttribute('address1_line3').setValue(null);
    Xrm.Page.getAttribute('new_cidadeid').setValue(null);
    Xrm.Page.getAttribute('new_estadoid').setValue(null);
    Xrm.Page.getAttribute('new_paisid').setValue(null);
    StatusEndereco();
}

function StatusEndereco() {
    if (Xrm.Page.getAttribute('address1_name').getValue() == null) { Xrm.Page.getControl('address1_name').setDisabled(false); } else { Xrm.Page.getControl('address1_name').setDisabled(true); }
    if (Xrm.Page.getAttribute('address1_line3').getValue() == null) { Xrm.Page.getControl('address1_line3').setDisabled(false); } else { Xrm.Page.getControl('address1_line3').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_cidadeid').getValue() == null) { Xrm.Page.getControl('new_cidadeid').setDisabled(false); } else { Xrm.Page.getControl('new_cidadeid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_estadoid').getValue() == null) { Xrm.Page.getControl('new_estadoid').setDisabled(false); } else { Xrm.Page.getControl('new_estadoid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_paisid').getValue() == null) { Xrm.Page.getControl('new_paisid').setDisabled(false); } else { Xrm.Page.getControl('new_paisid').setDisabled(true); }
}