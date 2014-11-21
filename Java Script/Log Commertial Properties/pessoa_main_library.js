/****************************************************************/
/*          Códigos Java Scritp's Entidade Pessoa          */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 26/08/2014                                   */
/*          Versão: 3.0                                         */
/****************************************************************/

function Onchange_new_telefoneprincipal() {
    maskPhone("new_telefoneprincipal");
}

function Onchange_new_telefonecelular() {
    maskPhone("new_telefonecelular");
}

function Onchange_new_outrotelefone() {
    maskPhone("new_outrotelefone");
}

function Onchange_new_cep() {
    if (Xrm.Page.getAttribute('new_cep').getValue() == null) {
        Xrm.Page.getAttribute('new_logradouro').setValue(null);
        Xrm.Page.getAttribute('new_bairro').setValue(null);
        Xrm.Page.getAttribute('new_cidadeid').setValue(null);
        Xrm.Page.getAttribute('new_estadoid').setValue(null);
        Xrm.Page.getAttribute('new_paisid').setValue(null);
        StatusEndereco();
    } else {
        BuscaCepMrvLog("new_cep", ProcessaRetornoCEP, ProcessaErroCep);
    }
}

function Onchange_new_cpf() {
    maskValidCpfCnpj("new_cpf");
}

function OnSave_new_pessoa() {
    forceSave("new_salvar");
    EnabledAllRecording();
}

function OnLoad_new_pessoa() {
    if (Xrm.Page.getAttribute('new_estadocivil').getValue() == 2) {
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(false);
        Xrm.Page.getAttribute("new_regimedecasamento").setRequiredLevel("required");
        Xrm.Page.getControl('new_conjugeid').setDisabled(false);
    } else {
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(true);
        Xrm.Page.getAttribute("new_regimedecasamento").setRequiredLevel("none");
        Xrm.Page.getControl('new_conjugeid').setDisabled(true);
    }
    StatusEndereco();
    OnChange_new_tipodepessoa();
}


function ProcessaRetornoCEP(data) {
    if (data != null) {
        if (data.Sucesso) {
            //Logradouro
            if (data.Logradouro !== "") { Xrm.Page.getAttribute('new_logradouro').setValue(data.Logradouro); } else { Xrm.Page.getAttribute('new_logradouro').setValue(null); }
            //Bairro
            if (data.Bairro !== "") { Xrm.Page.getAttribute('new_bairro').setValue(data.Bairro); } else { Xrm.Page.getAttribute('new_bairro').setValue(null); }
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
    Xrm.Page.getAttribute('new_logradouro').setValue(null);
    Xrm.Page.getAttribute('new_bairro').setValue(null);
    Xrm.Page.getAttribute('new_cidadeid').setValue(null);
    Xrm.Page.getAttribute('new_estadoid').setValue(null);
    Xrm.Page.getAttribute('new_paisid').setValue(null);
    StatusEndereco();
}

function StatusEndereco() {
    if (Xrm.Page.getAttribute('new_logradouro').getValue() == null) { Xrm.Page.getControl('new_logradouro').setDisabled(false); } else { Xrm.Page.getControl('new_logradouro').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_bairro').getValue() == null) { Xrm.Page.getControl('new_bairro').setDisabled(false); } else { Xrm.Page.getControl('new_bairro').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_cidadeid').getValue() == null) { Xrm.Page.getControl('new_cidadeid').setDisabled(false); } else { Xrm.Page.getControl('new_cidadeid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_estadoid').getValue() == null) { Xrm.Page.getControl('new_estadoid').setDisabled(false); } else { Xrm.Page.getControl('new_estadoid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_paisid').getValue() == null) { Xrm.Page.getControl('new_paisid').setDisabled(false); } else { Xrm.Page.getControl('new_paisid').setDisabled(true); }
}


function OnChange_new_estadocivil() {
    if (Xrm.Page.getAttribute('new_estadocivil').getValue() == 2) {
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(false);
        Xrm.Page.getAttribute("new_regimedecasamento").setRequiredLevel("required");
        Xrm.Page.getControl('new_conjugeid').setDisabled(false);
        //Xrm.Page.getAttribute("new_conjugeid").setRequiredLevel("required");

    } else {
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(true);
        Xrm.Page.getAttribute('new_regimedecasamento').setValue(null);
        Xrm.Page.getAttribute("new_regimedecasamento").setRequiredLevel("none");
        Xrm.Page.getControl('new_conjugeid').setDisabled(true);
        Xrm.Page.getAttribute('new_conjugeid').setValue(null);
        //Xrm.Page.getAttribute("new_conjugeid").setRequiredLevel("none");
    }
}

function OnChange_new_tipodepessoa() {
    if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 1) {//Fisica
        Xrm.Page.getAttribute("new_cargoid").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_sobrenome").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_rg").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_estadocivil").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_inscriomunicipal").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_inscricaoestadual").setRequiredLevel("none");
        Xrm.Page.getControl("new_sobrenome").setVisible(true);
        Xrm.Page.ui.tabs.get('tab_geral').sections.get('geral_section_pf').setVisible(true);
        Xrm.Page.ui.tabs.get('tab_geral').sections.get('geral_section_pj').setVisible(false);

    } else if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 2) {//Jurídica
        Xrm.Page.getAttribute("new_cargoid").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_sobrenome").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_rg").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_estadocivil").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_inscriomunicipal").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_inscricaoestadual").setRequiredLevel("required");
        Xrm.Page.getControl("new_sobrenome").setVisible(false);
        Xrm.Page.ui.tabs.get('tab_geral').sections.get('geral_section_pf').setVisible(false);
        Xrm.Page.ui.tabs.get('tab_geral').sections.get('geral_section_pj').setVisible(true);
    }
}