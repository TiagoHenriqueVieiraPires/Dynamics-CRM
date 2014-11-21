/*****************************************************************/
/*          Códigos Java Scritp's Entidade Cliente               */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 15/09/2014                                    */
/*          Versão: 9.0                                          */
/*****************************************************************/

function OnSave_account() {
    VerificaTelephone();
    PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
    forceSave("new_salvar");
    if (Xrm.Page.getAttribute("new_mesmo").getValue() == true) {
        Xrm.Page.getAttribute("address2_postalcode").setValue(Xrm.Page.getAttribute("address1_postalcode").getValue());
        Xrm.Page.getAttribute("address2_name").setValue(Xrm.Page.getAttribute("address1_name").getValue());
        Xrm.Page.getAttribute("address2_line2").setValue(Xrm.Page.getAttribute("address1_line2").getValue());
        Xrm.Page.getAttribute("address2_line3").setValue(Xrm.Page.getAttribute("address1_line3").getValue());
        Xrm.Page.getAttribute("address2_line1").setValue(Xrm.Page.getAttribute("address1_line1").getValue());
        Xrm.Page.getAttribute("new_cidadeecid").setValue(Xrm.Page.getAttribute("new_cidadeepid").getValue());
        Xrm.Page.getAttribute("new_estadoecid").setValue(Xrm.Page.getAttribute("new_estadoepid").getValue());
        Xrm.Page.getAttribute("new_paisecid").setValue(Xrm.Page.getAttribute("new_paisepid").getValue());
    }
}

function Onload_account() {
    VerificaTipoRelacao();
    VisibletTypePerson();
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getControl("new_tipodepessoa").setDisabled(false);
    } else {
        Xrm.Page.getControl("new_tipodepessoa").setDisabled(true);
    }
    if (Xrm.Page.getAttribute('new_cnpjcpf').getValue() !== null) {
        Xrm.Page.getControl("new_cnpjcpf").setDisabled(true);
    }
    if (Xrm.Page.getAttribute("new_estadocivil").getValue() == 2) {
        Xrm.Page.getAttribute('new_regimedecasamento').setRequiredLevel('required');
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(false);
    } else {
        Xrm.Page.getAttribute('new_regimedecasamento').setRequiredLevel('none');
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(true);
    }
    StatusEndereco();
    BloqueaEncerecoCobranca();
}

function Onchange_customertypecode() {
    VerificaTipoRelacao();
}

function Onchange_new_tipodepessoa() {
    VisibletTypePerson();
}

function Onchange_telephone1() {
    maskPhone("telephone1");
}

function Onchange_telephone2() {
    maskPhone("telephone2");
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
        Xrm.Page.getAttribute('new_cidadeepid').setValue(null);
        Xrm.Page.getAttribute('new_estadoepid').setValue(null);
        Xrm.Page.getAttribute('new_paisepid').setValue(null);
        StatusEndereco();
        OnChange_new_mesmo();
    } else {
        BuscaCepMrvLog("address1_postalcode", ProcessaRetornoCEP_P, ProcessaErroCep_P);
    }
}

function Onchange_address2_postalcode() {
    if (Xrm.Page.getAttribute('address2_postalcode').getValue() == null) {
        Xrm.Page.getAttribute('address2_name').setValue(null);
        Xrm.Page.getAttribute('address2_line3').setValue(null);
        Xrm.Page.getAttribute('new_cidadecid').setValue(null);
        Xrm.Page.getAttribute('new_estadoecid').setValue(null);
        Xrm.Page.getAttribute('new_paisecid').setValue(null);
        StatusEndereco();
    } else {
        BuscaCepMrvLog("address2_postalcode", ProcessaRetornoCEP_C, ProcessaErroCep_C);
    }
}

function Onchange_new_cnpjcpf() {
    if (Xrm.Page.getAttribute('new_cnpjcpf').getValue() !== null) {
        var entityRetrive = getEntityNodesDouble("account", "new_cnpjcpf", Xrm.Page.getAttribute('new_cnpjcpf').getValue(), "statecode", "Active");
        if (entityRetrive.length != 0) {
            alert("Já existe um clietne cadastrado com esse CPF-CNPJ. Favor Conferir.");
            Xrm.Page.getAttribute("new_cnpjcpf").setValue(null);
        }
    }
    if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 1) {
        maskValidCpf("new_cnpjcpf");
    } else {
        maskValidCnpj("new_cnpjcpf");
    }
}

function VisibletTypePerson() {
    if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 1) {
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Fisica').setVisible(true);
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Juridica').setVisible(false);
    } else {
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Fisica').setVisible(false);
        Xrm.Page.ui.tabs.get('Geral').sections.get('Pessoa_Juridica').setVisible(true);
    }
}

function VerificaTelephone() {
    if ((Xrm.Page.getAttribute('telephone1').getValue() == null) &&
        (Xrm.Page.getAttribute('telephone2').getValue() == null) &&
        (Xrm.Page.getAttribute('telephone3').getValue() == null)) {
        alert("Preencha no mínimo um campo de telefone.")
        Xrm.Page.getControl('telephone1').setFocus(true);
        event.returnValue = false;
    } else { EnabledAllRecording(); }
}

function VerificaTipoRelacao() {
    if (Xrm.Page.getAttribute('customertypecode').getValue() !== 2) {
        Xrm.Page.getAttribute('primarycontactid').setRequiredLevel('none');
        Xrm.Page.getAttribute('address1_postalcode').setRequiredLevel('none');
        Xrm.Page.getAttribute('address1_name').setRequiredLevel('none');
        Xrm.Page.getAttribute('address1_line3').setRequiredLevel('none');
        Xrm.Page.getAttribute('address1_line1').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_cidadeepid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_estadoepid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_paisepid').setRequiredLevel('none');
        Xrm.Page.getAttribute('address2_postalcode').setRequiredLevel('none');
        Xrm.Page.getAttribute('address2_name').setRequiredLevel('none');
        Xrm.Page.getAttribute('address2_line3').setRequiredLevel('none');
        Xrm.Page.getAttribute('address2_line1').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_cidadeecid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_estadoecid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_paisecid').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_cnpjcpf').setRequiredLevel('none');
        Xrm.Page.getAttribute('emailaddress3').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_inscrioestadual').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_inscricaomunicipal').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_rg').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_orgaoexpedidor').setRequiredLevel('none');
        Xrm.Page.getAttribute('new_estadocivil').setRequiredLevel('none');
    } else {
        Xrm.Page.getAttribute('primarycontactid').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_postalcode').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_name').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_line3').setRequiredLevel('required');
        Xrm.Page.getAttribute('address1_line1').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_cidadeepid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_estadoepid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_paisepid').setRequiredLevel('required');
        Xrm.Page.getAttribute('address2_postalcode').setRequiredLevel('required');
        Xrm.Page.getAttribute('address2_name').setRequiredLevel('required');
        Xrm.Page.getAttribute('address2_line3').setRequiredLevel('required');
        Xrm.Page.getAttribute('address2_line1').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_cidadeecid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_estadoecid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_paisecid').setRequiredLevel('required');
        Xrm.Page.getAttribute('new_cnpjcpf').setRequiredLevel('required');
        Xrm.Page.getAttribute('emailaddress3').setRequiredLevel('required');
        if (Xrm.Page.getAttribute('new_tipodepessoa').getValue() == 2) {
            Xrm.Page.getAttribute('new_inscrioestadual').setRequiredLevel('required');
            Xrm.Page.getAttribute('new_inscricaomunicipal').setRequiredLevel('required');
            Xrm.Page.getAttribute('new_nomefantasiaapelido').setRequiredLevel('required');
            Xrm.Page.getAttribute('new_rg').setRequiredLevel('none');
            Xrm.Page.getAttribute('new_orgaoexpedidor').setRequiredLevel('none');
            Xrm.Page.getAttribute('new_estadocivil').setRequiredLevel('none');
        } else {
            Xrm.Page.getAttribute('new_inscrioestadual').setRequiredLevel('none');
            Xrm.Page.getAttribute('new_inscricaomunicipal').setRequiredLevel('none');
            Xrm.Page.getAttribute('new_nomefantasiaapelido').setRequiredLevel('none');
            Xrm.Page.getAttribute('new_rg').setRequiredLevel('required');
            Xrm.Page.getAttribute('new_orgaoexpedidor').setRequiredLevel('required');
            Xrm.Page.getAttribute('new_estadocivil').setRequiredLevel('required');
        }
    }
}

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    } else {
        Xrm.Page.getAttribute("new_unidadedenegocioid").setValue(null);
    }
}

function OnChange_new_estadocivil() {
    if (Xrm.Page.getAttribute("new_estadocivil").getValue() == 2) {
        Xrm.Page.getAttribute('new_regimedecasamento').setRequiredLevel('required');
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(false);
    } else {
        Xrm.Page.getAttribute('new_regimedecasamento').setRequiredLevel('none');
        Xrm.Page.getAttribute("new_regimedecasamento").setValue(null);
        Xrm.Page.getControl('new_regimedecasamento').setDisabled(true);
    }
}

//Preenche a Unidade de Negócio
function PreencheUnidadeDeNegocio(Guid) {
    var entityUserRetrive = getEntityNodes('systemuser', 'systemuserid', Guid);
    var entityNodeUserRetrive = entityUserRetrive[0];
    var organizationId = entityNodeUserRetrive.selectSingleNode("q1:businessunitid");
    organizationId = organizationId.text;
    var entityRetrive = getEntityNodes('businessunit', 'businessunitid', organizationId);
    var entityNodeRetrive = entityRetrive[0];
    var organizationName = entityNodeRetrive.selectSingleNode("q1:name");
    organizationName = organizationName.text;
    var lookupData = new Array();
    var lookupItem = new Object();
    lookupItem.id = organizationId;
    lookupItem.typename = 'businessunit';
    lookupItem.name = organizationName;
    lookupData[0] = lookupItem;
    Xrm.Page.getAttribute("new_unidadedenegocioid").setValue(lookupData);
}

function OnChange_new_mesmo() {
    if (Xrm.Page.getAttribute("new_mesmo").getValue() == true) {
        Xrm.Page.getAttribute("address2_postalcode").setValue(Xrm.Page.getAttribute("address1_postalcode").getValue());
        Xrm.Page.getAttribute("address2_name").setValue(Xrm.Page.getAttribute("address1_name").getValue());
        Xrm.Page.getAttribute("address2_line2").setValue(Xrm.Page.getAttribute("address1_line2").getValue());
        Xrm.Page.getAttribute("address2_line3").setValue(Xrm.Page.getAttribute("address1_line3").getValue());
        Xrm.Page.getAttribute("address2_line1").setValue(Xrm.Page.getAttribute("address1_line1").getValue());
        Xrm.Page.getAttribute("new_cidadeecid").setValue(Xrm.Page.getAttribute("new_cidadeepid").getValue());
        Xrm.Page.getAttribute("new_estadoecid").setValue(Xrm.Page.getAttribute("new_estadoepid").getValue());
        Xrm.Page.getAttribute("new_paisecid").setValue(Xrm.Page.getAttribute("new_paisepid").getValue());
    }
    BloqueaEncerecoCobranca();
}

/*CEP Principal*/
function ProcessaRetornoCEP_P(data) {
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
                    Xrm.Page.getAttribute("new_estadoepid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_estadoepid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_estadoepid').setValue(null); }
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
                    Xrm.Page.getAttribute("new_paisepid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_paisepid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_paisepid').setValue(null); }
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
                    Xrm.Page.getAttribute("new_cidadeepid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_cidadeepid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_cidadeepid').setValue(null); }
        } else { ProcessaErroCep_P(); }
    }
    StatusEndereco();
    maskValidCep("address1_postalcode");
    OnChange_new_mesmo();
}

function ProcessaErroCep_P() {
    alert("CEP não encontrado. Favor digitar o endereço.");
    Xrm.Page.getAttribute('address1_name').setValue(null);
    Xrm.Page.getAttribute('address1_line3').setValue(null);
    Xrm.Page.getAttribute('new_cidadeepid').setValue(null);
    Xrm.Page.getAttribute('new_estadoepid').setValue(null);
    Xrm.Page.getAttribute('new_paisepid').setValue(null);
    StatusEndereco();
}

/*Endereço Cobrança*/
function ProcessaRetornoCEP_C(data) {
    if (data != null) {
        if (data.Sucesso) {
            //Logradouro
            if (data.Logradouro !== "") { Xrm.Page.getAttribute('address2_name').setValue(data.Logradouro); } else { Xrm.Page.getAttribute('address2_name').setValue(null); }
            //Bairro
            if (data.Bairro !== "") { Xrm.Page.getAttribute('address2_line3').setValue(data.Bairro); } else { Xrm.Page.getAttribute('address2_line3').setValue(null); }
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
                    Xrm.Page.getAttribute("new_estadoecid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_estadoecid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_estadoecid').setValue(null); }
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
                    Xrm.Page.getAttribute("new_paisecid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_paisecid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_paisecid').setValue(null); }
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
                    Xrm.Page.getAttribute("new_cidadeecid").setValue(lookupData);
                } else { Xrm.Page.getAttribute('new_cidadeecid').setValue(null); }
            } else { Xrm.Page.getAttribute('new_cidadeecid').setValue(null); }
        } else { ProcessaErroCep_C(); }
    }
    StatusEndereco();
    maskValidCep("address2_postalcode");
}

function ProcessaErroCep_C() {
    alert("CEP não encontrado. Favor digitar o endereço.");
    Xrm.Page.getAttribute('address2_name').setValue(null);
    Xrm.Page.getAttribute('address2_line3').setValue(null);
    Xrm.Page.getAttribute('new_cidadeecid').setValue(null);
    Xrm.Page.getAttribute('new_estadoecid').setValue(null);
    Xrm.Page.getAttribute('new_paisecid').setValue(null);
    StatusEndereco();
}

function StatusEndereco() {
    if (Xrm.Page.getAttribute('address1_name').getValue() == null) { Xrm.Page.getControl('address1_name').setDisabled(false); } else { Xrm.Page.getControl('address1_name').setDisabled(true); }
    if (Xrm.Page.getAttribute('address1_line3').getValue() == null) { Xrm.Page.getControl('address1_line3').setDisabled(false); } else { Xrm.Page.getControl('address1_line3').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_cidadeepid').getValue() == null) { Xrm.Page.getControl('new_cidadeepid').setDisabled(false); } else { Xrm.Page.getControl('new_cidadeepid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_estadoepid').getValue() == null) { Xrm.Page.getControl('new_estadoepid').setDisabled(false); } else { Xrm.Page.getControl('new_estadoepid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_paisepid').getValue() == null) { Xrm.Page.getControl('new_paisepid').setDisabled(false); } else { Xrm.Page.getControl('new_paisepid').setDisabled(true); }

    if (Xrm.Page.getAttribute('address2_name').getValue() == null) { Xrm.Page.getControl('address2_name').setDisabled(false); } else { Xrm.Page.getControl('address2_name').setDisabled(true); }
    if (Xrm.Page.getAttribute('address2_line3').getValue() == null) { Xrm.Page.getControl('address2_line3').setDisabled(false); } else { Xrm.Page.getControl('address2_line3').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_cidadeecid').getValue() == null) { Xrm.Page.getControl('new_cidadeecid').setDisabled(false); } else { Xrm.Page.getControl('new_cidadeecid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_estadoecid').getValue() == null) { Xrm.Page.getControl('new_estadoecid').setDisabled(false); } else { Xrm.Page.getControl('new_estadoecid').setDisabled(true); }
    if (Xrm.Page.getAttribute('new_paisecid').getValue() == null) { Xrm.Page.getControl('new_paisecid').setDisabled(false); } else { Xrm.Page.getControl('new_paisecid').setDisabled(true); }
}

function BloqueaEncerecoCobranca() {
    if (Xrm.Page.getAttribute("new_mesmo").getValue() == true) {
        Xrm.Page.getControl('address2_postalcode').setDisabled(true);
        Xrm.Page.getControl('address2_name').setDisabled(true);
        Xrm.Page.getControl('address2_line2').setDisabled(true);
        Xrm.Page.getControl('address2_line3').setDisabled(true);
        Xrm.Page.getControl('address2_line1').setDisabled(true);
        Xrm.Page.getControl('new_cidadeecid').setDisabled(true);
        Xrm.Page.getControl('new_estadoecid').setDisabled(true);
        Xrm.Page.getControl('new_paisecid').setDisabled(true);
    } else {
        Xrm.Page.getControl('address2_postalcode').setDisabled(false);
        Xrm.Page.getControl('address2_name').setDisabled(false);
        Xrm.Page.getControl('address2_line2').setDisabled(false);
        Xrm.Page.getControl('address2_line3').setDisabled(false);
        Xrm.Page.getControl('address2_line1').setDisabled(false);
        Xrm.Page.getControl('new_cidadeecid').setDisabled(false);
        Xrm.Page.getControl('new_estadoecid').setDisabled(false);
        Xrm.Page.getControl('new_paisecid').setDisabled(false);
        StatusEndereco();
    }
}

function OnChange_accountnumber() {
    if (Xrm.Page.getAttribute("accountnumber").getValue() !== null) {
        var accountNumber = Xrm.Page.getAttribute("accountnumber").getValue();
        accountNumber = accountNumber.replace(/[^0-9]/g, '');
        if (accountNumber.length !== 10) {
            alert("Número de Cliente Inválido.Mínimo 10 Caracteres. Ex. 1234567890");
            Xrm.Page.getAttribute("accountnumber").setValue('');
        } else {
            Xrm.Page.getAttribute("accountnumber").setValue(accountNumber);
        }
    }    
}