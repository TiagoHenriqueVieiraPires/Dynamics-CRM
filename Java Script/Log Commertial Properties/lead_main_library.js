/*****************************************************************/
/*          Códigos Java Scritp's Entidade Cliente Potencial     */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 15/09/2014                                    */
/*          Versão: 4.0                                          */
/*****************************************************************/

function OnSave_Lead() {
    VerificaTelephone();
    forceSave("new_salvar");
}

function Onload_Lead() {
    VisibletTypePerson();
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getControl("new_tipodepessoa").setDisabled(false);
    } else {
        Xrm.Page.getControl("new_tipodepessoa").setDisabled(true);
    }
    StatusEndereco();
}

function Onchange_new_tipodepessoa() {
    VisibletTypePerson();
}

function Onchange_telephone1() {
    maskPhone("telephone1");
}

function Onchange_mobilephone() {
    maskPhone("mobilephone");
}

function Onchange_telephone3() {
    maskPhone("telephone3");
}

function Onchange_fax() {
    maskPhone("fax");
}

function Onchange_address1_telephone1() {
    maskPhone("address1_telephone1");
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

function Onchange_new_cnpjcpf() {
    if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 1) {
        maskValidCpf("new_cnpjcpf");
    }
    else {
        maskValidCnpj("new_cnpjcpf");
    }
}

function Onchange_new_metragemdeemdereco() {
    Xrm.Page.getAttribute('new_metragem').setValue(Xrm.Page.getAttribute('new_metragemdeendereco').getValue());
}

function VisibletTypePerson() {
    if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 1) {
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Fisica').setVisible(true);
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Juridica').setVisible(false);
        Xrm.Page.getAttribute('new_contatoprincipal').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_cargodocontatoid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_emailcontatoprincipal').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_telephone1').setRequiredLevel('required');
    }
    else {
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Fisica').setVisible(false);
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Juridica').setVisible(true);
        Xrm.Page.getAttribute('new_contatoprincipal').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_cargodocontatoid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_emailcontatoprincipal').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_telephone1').setRequiredLevel('required');
    }
}

function VerificaTelephone() {
    if ((Xrm.Page.getAttribute('telephone1').getValue() == null) && (Xrm.Page.getAttribute('mobilephone').getValue() == null) && (Xrm.Page.getAttribute('telephone3').getValue() == null)) {
        alert("Preencha no mínimo um campo de telefone.")
        Xrm.Page.getControl('telephone1').setFocus(true);
        event.returnValue = false;
    } else { EnabledAllRecording(); }
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