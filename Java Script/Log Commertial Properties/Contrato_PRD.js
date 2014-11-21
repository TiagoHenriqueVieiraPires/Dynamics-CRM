/*****************************************************************/
/*          Códigos Java Scritp's Entidade Contrato              */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 01/10/2014                                    */
/*          Versão: 34.0                                         */
/*****************************************************************/

function OnChange_new_contratosap() {
    if (Xrm.Page.getAttribute("new_contratosap").getValue() !== null) {
        var accountNumber = Xrm.Page.getAttribute("new_contratosap").getValue();
        accountNumber = accountNumber.replace(/[^0-9]/g, '');
        if (accountNumber.length !== 8) {
            alert("Número de Contrato Inválido.Mínimo 8 Caracteres. Ex. 12345678");
            Xrm.Page.getAttribute("new_contratosap").setValue('');
        } else {
            Xrm.Page.getAttribute("new_contratosap").setValue(accountNumber);
        }
    }
}

function CreateContractDetail(empreendimentoId, productId, quantidade, uomId, valorUnitario, valroBruto, contratoId, dataInicio, dataFim) {
    var entityProduct = getEntityNodes("product", "productid", productId);
    var name = "";
    if (entityProduct.length != 0) {
        var entityProductNode = entityProduct[0];
        name = entityProductNode.selectSingleNode("q1:name");
        name = name.text;
    }
    var xml = "<?xml version='1.0' encoding='utf-8'?>" +
    "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
    " xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
    " xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
    GenerateAuthenticationHeader() +
    "<soap:Body>" +
    "<Create xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
    "<entity xsi:type='contractdetail'>" +
        "<new_emprendimentoid>" + empreendimentoId + "</new_emprendimentoid>" +
        "<productid>" + productId + "</productid>" +
        "<new_quantidade>" + quantidade + "</new_quantidade>" +
        "<uomid>" + uomId + "</uomid>" +
        "<new_valornominal>" + valorUnitario + "</new_valornominal>" +
        "<price>" + valroBruto + "</price>" +
        "<new_contratoid>" + contratoId + "</new_contratoid>" +
        // "<totalallotments>" + quantidade + "</totalallotments>" +
         "<title>" + name + "</title>" +
         "<activeon>" + dataInicio + "</activeon>" +
         "<expireson>" + dataFim + "</expireson>" +
         "<new_statusdalinha>" + 1 + "</new_statusdalinha>" +
         "<contractid>" + contratoId + "</contractid>" +
    "</entity>" +
    "</Create>" +
    "</soap:Body>" +
    "</soap:Envelope>";
    var xHReq = new ActiveXObject("Msxml2.XMLHTTP");
    xHReq.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xHReq.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Create");
    xHReq.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xHReq.setRequestHeader("Content-Length", xml.length);
    xHReq.send(xml);
    var resultXml = xHReq.responseXML;
    var errorCount = resultXml.selectNodes('//error').length;
    if (errorCount != 0) {
        var msg = resultXml.selectSingleNode('//description').nodeTypedValue;
        alert(msg);
    }
    else { }
}

function AlteraOpotunidadeAberta() {
    if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 1) {
        var entityUserRetrive = getEntityNodes('quote', 'quoteid', Xrm.Page.getAttribute("new_propostaid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var oportunidadeId = entityNodeUserRetrive.selectSingleNode("q1:opportunityid");
        oportunidadeId = oportunidadeId.text;
        setEntityNode("opportunity", "opportunityid", oportunidadeId, "new_contratofechado", 1, 0);
    }
}

function StatusDoContrato() {
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 1) {
            //Rascunho
        } else if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2) {
            //Assinado
            DisabledAllRecording();
        } else if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 3) {
            //Suspenso
            DisabledAllRecording();
        } else if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 4) {
            //Cancelado
            DisabledAllRecording();
        } else if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 6) {
            //Em Assinatura
        } else {
            //Distratado
            DisabledAllRecording();
        }
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

function PreencheModeloDeContratoPadrao() {
    if (Xrm.Page.getAttribute("contracttemplateid").getValue() == null) {
        var entityRetrive = getEntityNodes('contracttemplate', 'abbreviation', "LOG-AL");
        var entityNodeRetrive = entityRetrive[0];
        var id = entityNodeRetrive.selectSingleNode("q1:contracttemplateid");
        id = id.text;
        var name = entityNodeRetrive.selectSingleNode("q1:name");
        name = name.text;
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = id;
        lookupItem.typename = 'contracttemplate';
        lookupItem.name = name;
        lookupData[0] = lookupItem;
        Xrm.Page.getAttribute("contracttemplateid").setValue(lookupData);
    }
}

//Solicita o Valor da Garanta dependendo do Tipo
function TipoDeGarantia() {
    if (Xrm.Page.getAttribute("new_tipodegarantia").getValue() !== null) {
        var tipoGarantia = Xrm.Page.getAttribute("new_tipodegarantia").getValue();
        Xrm.Page.getAttribute("new_garantiaentregue").setRequiredLevel("none");
        Xrm.Page.getControl("new_garantiaentregue").setVisible(false);
        Xrm.Page.getControl("new_datadaentregagarantia").setVisible(false);
        Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("none");
        Xrm.Page.getControl("new_matriculadoimovel").setVisible(false);
        Xrm.Page.getAttribute("new_matriculadoimovel").setRequiredLevel("none");
        Xrm.Page.getControl("new_instituicaofinanceiraseguradoraid").setVisible(false);
        Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("none");
        Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(false);
        Xrm.Page.getAttribute("new_observacaodagarantia").setRequiredLevel("none");
        Xrm.Page.getControl("new_valordagarantia").setVisible(true);
        Xrm.Page.getControl("new_datadevalidadegarantia").setVisible(true);
        if (tipoGarantia == 1) {//Fiador Com imóvel
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("recommended");
            Xrm.Page.getControl("new_matriculadoimovel").setVisible(true);
            Xrm.Page.getAttribute("new_matriculadoimovel").setRequiredLevel("required");
        } else if (tipoGarantia == 2) {//Carta Fiança
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_garantiaentregue").setRequiredLevel("required");
            Xrm.Page.getControl("new_garantiaentregue").setVisible(true);
            Xrm.Page.getControl("new_datadaentregagarantia").setVisible(true);
            Xrm.Page.getControl("new_instituicaofinanceiraseguradoraid").setVisible(true);
            if (Xrm.Page.getAttribute("new_garantiaentregue").getValue() == true) {
                Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("required");
                Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("required");
            } else {
                Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("none");
                Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("none");
            }
        } else if (tipoGarantia == 3) {//Seguro Fiança
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_garantiaentregue").setRequiredLevel("required");
            Xrm.Page.getControl("new_garantiaentregue").setVisible(true);
            Xrm.Page.getControl("new_datadaentregagarantia").setVisible(true);
            Xrm.Page.getControl("new_instituicaofinanceiraseguradoraid").setVisible(true);
            if (Xrm.Page.getAttribute("new_garantiaentregue").getValue() == true) {
                Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("required");
                Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("required");
            } else {
                Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("none");
                Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("none");
            }
        } else if (tipoGarantia == 4) {//Caução
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");

        } else if (tipoGarantia == 5) {//Imóvel
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("recommended");
            Xrm.Page.getControl("new_matriculadoimovel").setVisible(true);
            Xrm.Page.getAttribute("new_matriculadoimovel").setRequiredLevel("required");
        } else if (tipoGarantia == 6) {//Fora do Padrão
            Xrm.Page.getAttribute("new_datadevalidadegarantia").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(true);
            Xrm.Page.getAttribute("new_observacaodagarantia").setRequiredLevel("required");
        } else if (tipoGarantia == 7) {//Sem Garantia
            Xrm.Page.getAttribute("new_datadevalidadegarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(true);
            Xrm.Page.getAttribute("new_observacaodagarantia").setRequiredLevel("required");
            Xrm.Page.getControl("new_valordagarantia").setVisible(false);
            Xrm.Page.getControl("new_datadevalidadegarantia").setVisible(false);
        } else {
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(false);
            Xrm.Page.getAttribute("new_observacaodagarantia").setRequiredLevel("none");
        }
    } else {
        Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_datadevalidadegarantia").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_garantiaentregue").setRequiredLevel("none");
        Xrm.Page.getControl("new_garantiaentregue").setVisible(false);
        Xrm.Page.getControl("new_datadaentregagarantia").setVisible(false);
        Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("none");
        Xrm.Page.getControl("new_matriculadoimovel").setVisible(false);
        Xrm.Page.getAttribute("new_matriculadoimovel").setRequiredLevel("none");
        Xrm.Page.getControl("new_instituicaofinanceiraseguradoraid").setVisible(false);
        Xrm.Page.getAttribute("new_instituicaofinanceiraseguradoraid").setRequiredLevel("none");
    }
    HideShowInfoContato();
}

function CadastroCompleto() {
    if (Xrm.Page.getAttribute("customerid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('account', 'accountid', Xrm.Page.getAttribute("customerid").getValue()[0].id);
        if (entityUserRetrive.length !== 0) {
            var entityNodeUserRetrive = entityUserRetrive[0];
            var tipoDeRelacao = entityNodeUserRetrive.selectSingleNode("q1:customertypecode");
            if (tipoDeRelacao !== null) { tipoDeRelacao = tipoDeRelacao.text; } else { tipoDeRelacao = 1; }
            if (tipoDeRelacao == 2) {
                //var primarycontactid = entityNodeUserRetrive.selectSingleNode("q1:primarycontactid");
                var primarycontactid = '2';
                var address1_postalcode = entityNodeUserRetrive.selectSingleNode("q1:address1_postalcode");
                var address1_name = entityNodeUserRetrive.selectSingleNode("q1:address1_name");
                var address1_line2 = entityNodeUserRetrive.selectSingleNode("q1:address1_line2");
                var address1_line3 = entityNodeUserRetrive.selectSingleNode("q1:address1_line3");
                var address1_line1 = entityNodeUserRetrive.selectSingleNode("q1:address1_line1");
                var new_cidadeepid = entityNodeUserRetrive.selectSingleNode("q1:new_cidadeepid");
                var new_estadoepid = entityNodeUserRetrive.selectSingleNode("q1:new_estadoepid");
                var new_paisepid = entityNodeUserRetrive.selectSingleNode("q1:new_paisepid");
                var address2_postalcode = entityNodeUserRetrive.selectSingleNode("q1:address2_postalcode");
                var address2_name = entityNodeUserRetrive.selectSingleNode("q1:address2_name");
                var address2_line2 = entityNodeUserRetrive.selectSingleNode("q1:address2_line2");
                var address2_line3 = entityNodeUserRetrive.selectSingleNode("q1:address2_line3");
                var address2_line1 = entityNodeUserRetrive.selectSingleNode("q1:address2_line1");
                var new_cidadeecid = entityNodeUserRetrive.selectSingleNode("q1:new_cidadeecid");
                var new_estadoecid = entityNodeUserRetrive.selectSingleNode("q1:new_estadoecid");
                var new_paisecid = entityNodeUserRetrive.selectSingleNode("q1:new_paisecid");
                var new_cnpjcpf = entityNodeUserRetrive.selectSingleNode("q1:new_cnpjcpf");
                if (primarycontactid == null || address1_postalcode == null ||
                    address1_name == null || address1_line1 == null ||
                    address1_line3 == null ||
                    new_cidadeepid == null || new_estadoepid == null ||
                    new_paisepid == null || address2_postalcode == null ||
                    address2_name == null || address2_line1 == null ||
                    address2_line3 == null ||
                    new_cidadeecid == null || new_estadoecid == null ||
                    new_paisecid == null || new_cnpjcpf == null) {
                    return "Error";
                } else { return "OK"; }
            } else { return "OK"; }
        } else { return "Error"; }
    } else { return "Error"; }
}

function OnSave_Contract(prmContext) {
    forceSave("new_salvar");
    if (CadastroCompleto() !== "OK") {
        alert("Solicitação de Contrato, favor completar o cadastro do Cliente.");
    }
    if (Xrm.Page.ui.getFormType() == 1) {
        SetDataDefault('expireson', 99);
        SetDataDefault('activeon', 1);
        PreencheModeloDeContratoPadrao();
    }
    if (Xrm.Page.ui.getFormType() !== 4) {
        if (Xrm.Page.getAttribute("contractnumber").getValue() !== null) {
            Xrm.Page.getAttribute("title").setValue("No. " + Xrm.Page.getAttribute("contractnumber").getValue());
            OnChange_new_condicaodevigencia();
            if ((Xrm.Page.getAttribute("new_datadoenvio").getValue() == null) && (Xrm.Page.getAttribute("new_espelhodecontrato").getValue() == true)) {
                Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            }
            if ((Xrm.Page.getAttribute("new_datadoenvioassinatura").getValue() == null) && (Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true)) {
                Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(new Date());
                Xrm.Page.getAttribute('new_statusdocontrato').setValue(6);
            }
        }
        OnChange_ownerid();
        OnChange_customerid();
        Xrm.Page.getControl("new_accountnumber").setDisabled(false);
        Xrm.Page.getControl("originatingcontract").setDisabled(false);
        Xrm.Page.getControl("new_datadaanalisecadastral").setDisabled(false);
        Xrm.Page.getControl("new_comentariodaanalisecadastral").setDisabled(false);
        Xrm.Page.getControl("new_datadaanalisejuridica").setDisabled(false);
        Xrm.Page.getControl("new_comentariodaanalisejuridica").setDisabled(false);
        Xrm.Page.getControl("new_datadaanalisecredito").setDisabled(false);
        Xrm.Page.getControl("new_comentariodaanalisecredito").setDisabled(false);
        Xrm.Page.getControl("new_indiceid").setDisabled(false);
        Xrm.Page.getControl("new_receitavariavel").setDisabled(false);
        Xrm.Page.getControl("new_tipodecontrato").setDisabled(false);
        Xrm.Page.getControl("new_solicitarcontratocomerciallog").setDisabled(false);
        Xrm.Page.getControl("new_datadasolicitaolog").setDisabled(false);
        Xrm.Page.getControl("new_espelhodecontrato").setDisabled(false);
        Xrm.Page.getControl("new_datadoenvio").setDisabled(false);
        Xrm.Page.getControl("new_expireson").setDisabled(false);
        Xrm.Page.getControl("billingendon").setDisabled(false);
        Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(false);
        Xrm.Page.getControl("new_enviadoparaassinatura").setDisabled(false);
        Xrm.Page.getControl("new_activeon").setDisabled(false);
        Xrm.Page.getControl("billingstarton").setDisabled(false);
        Xrm.Page.getControl("new_carnciadias").setDisabled(false);
        OnChange_new_empreendimentoid();
        OnChange_activeon();
        AluguelMedioMensal();
        if ((Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 2) || (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3)) {
            Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("required");
            Xrm.Page.getControl("originatingcontract").setDisabled(false);
        } else {
            Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("none");
            Xrm.Page.getAttribute("originatingcontract").setValue(null);
            Xrm.Page.getControl("originatingcontract").setDisabled(true);
        }
    }
    Xrm.Page.getControl("new_datadoenvio").setDisabled(false);
    if ((Xrm.Page.ui.getFormType() == 1) && ((currentUserHasRole('Comercial LOG') == true) || (currentUserHasRole('Administrador do Sistema') == true))) {
        Xrm.Page.getAttribute("new_contratoid").setValue(Xrm.Page.getAttribute("originatingcontract").getValue());
        if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3) {
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(true);
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
        }
    }
}

function Onload_Contract() {
    if ((Xrm.Page.ui.getFormType() == 2) && (Xrm.Page.getAttribute('new_produtoinserido').getValue() == false)) {
        PropostaParaContrato();
    }
    if (Xrm.Page.ui.getFormType() == 1) {
        SetDataDefault('expireson', 99);
        SetDataDefault('activeon', 1);
        PreencheModeloDeContratoPadrao();
    }
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getAttribute("activeon").setRequiredLevel("none");
        Xrm.Page.getAttribute("expireson").setRequiredLevel("none");
        if (Xrm.Page.ui.getFormType() == 1) {
            OnChange_ownerid();
            Xrm.Page.getControl("new_espelhodecontrato").setDisabled(true);
            Xrm.Page.getControl("new_solicitarcontratocomerciallog").setDisabled(true);
        }
        if ((Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 2) || (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3)) {
            Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("required");
            Xrm.Page.getControl("originatingcontract").setDisabled(false);
        } else {
            Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("none");
            Xrm.Page.getControl("originatingcontract").setDisabled(true);
        }
        TipoDeGarantia();
        OnChange_new_analisecadastral();
        OnChange_new_analisejuridica();
        OnChange_new_analisedecredito();
        OnChange_new_condicaodevigencia();
    }
    Xrm.Page.getAttribute("billingcustomerid").setRequiredLevel("none");
    if (Xrm.Page.getAttribute("new_tipodecontratoid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('new_tipodecontrato', 'new_tipodecontratoid', Xrm.Page.getAttribute("new_tipodecontratoid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var receitaVariavel = entityNodeUserRetrive.selectSingleNode("q1:new_receitavariavel");
        if (receitaVariavel !== null) { receitaVariavel = receitaVariavel.text; } else { receitaVariavel = 0; }
        if (receitaVariavel == 1) { Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("required"); } else { Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none"); Xrm.Page.getControl("new_receitavariavel").setDisabled(true); }
    } else { Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none"); Xrm.Page.getControl("new_receitavariavel").setDisabled(true); }
    //Contrato sendo Atualizado
    if (Xrm.Page.ui.getFormType() == 2) {
        Xrm.Page.getControl("new_tipodecontrato").setDisabled(true);
        Xrm.Page.getControl("originatingcontract").setDisabled(true);
        //Xrm.Page.getControl("new_tipodecontratoid").setDisabled(true);
        Xrm.Page.getControl("new_propostaid").setDisabled(true);
        if (Xrm.Page.getAttribute("new_tipodecontratoid").getValue() !== null) { Xrm.Page.getControl("new_tipodecontratoid").setDisabled(true); } else { Xrm.Page.getControl("new_tipodecontratoid").setDisabled(false); }
        Xrm.Page.getControl("new_empreendimentoid").setDisabled(true);
        Xrm.Page.getControl("customerid").setDisabled(true);
        OnChange_customerid();
    }
    if ((Xrm.Page.ui.getFormType() == 2) && (Xrm.Page.getAttribute("new_espelhodecontrato").getValue() == true)) {
        Xrm.Page.getControl("new_espelhodecontrato").setDisabled(true);
        //Xrm.Page.getControl("new_datadoenvio").setDisabled(true);
    }
    if ((Xrm.Page.ui.getFormType() == 2) && (Xrm.Page.getAttribute("new_solicitarcontratocomerciallog").getValue() == true)) {
        Xrm.Page.getControl("new_solicitarcontratocomerciallog").setDisabled(true);
        //Xrm.Page.getControl("new_datadasolicitaolog").setDisabled(true);
    }
    StatusDoContrato();
    VisivelAposAssinatura();
    if ((Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true) || (Xrm.Page.getAttribute("new_espelhodecontrato").getValue() == false)) {
        //Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(true);
        Xrm.Page.getControl("new_enviadoparaassinatura").setDisabled(true);
    }
    if (((currentUserHasRole('Financeiro') == true) || (currentUserHasRole('Administrador do Sistema') == true)) && (Xrm.Page.ui.getFormType() == 2) && (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2)) {
        Xrm.Page.getControl("new_valordagarantia").setDisabled(false);
        Xrm.Page.getControl("new_datadevalidadegarantia").setDisabled(false);
        Xrm.Page.getControl("new_ratingid").setDisabled(false);
    }
    if (Xrm.Page.getAttribute("new_multaescalonada").getValue() == 1) {
        Xrm.Page.getAttribute("new_dias").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_multaesctexto").setRequiredLevel("required");
        Xrm.Page.getControl("new_dias").setVisible(true);
        Xrm.Page.getControl("new_multaesctexto").setVisible(true);
    } else {
        Xrm.Page.getAttribute("new_dias").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_multaesctexto").setRequiredLevel("none");
        Xrm.Page.getControl("new_dias").setVisible(false);
        Xrm.Page.getControl("new_multaesctexto").setVisible(false);
    }
    if (Xrm.Page.getAttribute("new_contratosap").getValue() == null) {
        Xrm.Page.getControl("new_contratosap").setDisabled(false);
    }
    HideShowInfoContato();
    ContratoCDU();
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getControl("new_datadoenvio").setDisabled(true);
        Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(true);
        if ((Xrm.Page.getAttribute("new_datadoenvio").getValue() == null) && (Xrm.Page.getAttribute("new_espelhodecontrato").getValue() == true)) {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
        }
        if ((Xrm.Page.getAttribute("new_datadoenvioassinatura").getValue() == null) && (Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true)) {
            Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(new Date());
            Xrm.Page.getAttribute('new_statusdocontrato').setValue(6);
            Xrm.Page.data.entity.save("save");
        }
    }
    if (Xrm.Page.getAttribute("originatingcontract").getValue() !== null) {
        Xrm.Page.getControl("originatingcontract").setDisabled(true);
    }
    ComplementoDoAditivo();
}

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
        var entityUserRetrive = getEntityNodes('systemuser', 'systemuserid', Xrm.Page.getAttribute("ownerid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var equipeDeVendas = entityNodeUserRetrive.selectSingleNode("q1:new_equipedevendas");
        if (equipeDeVendas !== null) { equipeDeVendas = equipeDeVendas.text } else { equipeDeVendas = ""; }
        Xrm.Page.getAttribute("new_equipedevendas").setValue(equipeDeVendas);
    } else {
        Xrm.Page.getAttribute("new_equipedevendas").setValue("");
        Xrm.Page.getAttribute("new_unidadedenegocioid").setValue(null);
    }
}

function OnChange_new_tipodecontrato() {
    if ((Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 2) || (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3)) {
        Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("required");
        Xrm.Page.getControl("originatingcontract").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("none");
        Xrm.Page.getAttribute("originatingcontract").setValue(null);
        Xrm.Page.getControl("originatingcontract").setDisabled(true);
    }
    Xrm.Page.getAttribute("new_contratoid").setValue(Xrm.Page.getAttribute("originatingcontract").getValue());
    ContratoCDU();
    /*Altedo 29/08/2014*/
    if (Xrm.Page.ui.getFormType() == 1) {
        OnChange_new_propostaid();
    }

}

function OnChange_new_analisecadastral() {
    if ((Xrm.Page.getAttribute("new_analisecadastral").getValue() !== 1) && (Xrm.Page.getAttribute("new_analisecadastral").getValue() !== 2) && (Xrm.Page.getAttribute("new_analisecadastral").getValue() !== null)) {
        Xrm.Page.getAttribute("new_datadaanalisecadastral").setRequiredLevel("required");
        Xrm.Page.getControl("new_datadaanalisecadastral").setDisabled(false);
        Xrm.Page.getAttribute("new_comentariodaanalisecadastral").setRequiredLevel("required");
        Xrm.Page.getControl("new_comentariodaanalisecadastral").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("new_datadaanalisecadastral").setRequiredLevel("none");
        Xrm.Page.getControl("new_datadaanalisecadastral").setDisabled(true);
        Xrm.Page.getAttribute("new_comentariodaanalisecadastral").setRequiredLevel("none");
        Xrm.Page.getControl("new_comentariodaanalisecadastral").setDisabled(true);
        if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
            Xrm.Page.getAttribute("new_datadaanalisecadastral").setValue(null);
            Xrm.Page.getAttribute("new_comentariodaanalisecadastral").setValue(null);
        }
    }
}

function OnChange_new_analisejuridica() {
    if ((Xrm.Page.getAttribute("new_analisejuridica").getValue() !== 1) && (Xrm.Page.getAttribute("new_analisejuridica").getValue() !== 2) && (Xrm.Page.getAttribute("new_analisejuridica").getValue() !== null)) {
        Xrm.Page.getAttribute("new_datadaanalisejuridica").setRequiredLevel("required");
        Xrm.Page.getControl("new_datadaanalisejuridica").setDisabled(false);
        Xrm.Page.getAttribute("new_comentariodaanalisejuridica").setRequiredLevel("required");
        Xrm.Page.getControl("new_comentariodaanalisejuridica").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("new_datadaanalisejuridica").setRequiredLevel("none");
        Xrm.Page.getControl("new_datadaanalisejuridica").setDisabled(true);
        Xrm.Page.getAttribute("new_comentariodaanalisejuridica").setRequiredLevel("none");
        Xrm.Page.getControl("new_comentariodaanalisejuridica").setDisabled(true);
        if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
            Xrm.Page.getAttribute("new_datadaanalisejuridica").setValue(null);
            Xrm.Page.getAttribute("new_comentariodaanalisejuridica").setValue(null);
        }
    }
}

function OnChange_new_analisedecredito() {
    if ((Xrm.Page.getAttribute("new_analisedecredito").getValue() !== 1) && (Xrm.Page.getAttribute("new_analisedecredito").getValue() !== 2) && (Xrm.Page.getAttribute("new_analisedecredito").getValue() !== null)) {
        Xrm.Page.getAttribute("new_datadaanalisecredito").setRequiredLevel("required");
        Xrm.Page.getControl("new_datadaanalisecredito").setDisabled(false);
        Xrm.Page.getAttribute("new_comentariodaanalisecredito").setRequiredLevel("required");
        Xrm.Page.getControl("new_comentariodaanalisecredito").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("new_datadaanalisecredito").setRequiredLevel("none");
        Xrm.Page.getControl("new_datadaanalisecredito").setDisabled(true);
        Xrm.Page.getAttribute("new_comentariodaanalisecredito").setRequiredLevel("none");
        Xrm.Page.getControl("new_comentariodaanalisecredito").setDisabled(true);
        if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
            Xrm.Page.getAttribute("new_datadaanalisecredito").setValue(null);
            Xrm.Page.getAttribute("new_comentariodaanalisecredito").setValue(null);
        }
    }
}

function OnChange_new_tipodecontratoid() {
    if (Xrm.Page.getAttribute("new_tipodecontratoid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('new_tipodecontrato', 'new_tipodecontratoid', Xrm.Page.getAttribute("new_tipodecontratoid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var id = entityNodeUserRetrive.selectSingleNode("q1:new_indiceid");
        id = id.text;
        var receitaVariavel = entityNodeUserRetrive.selectSingleNode("q1:new_receitavariavel");
        if (receitaVariavel !== null) { receitaVariavel = receitaVariavel.text; } else { receitaVariavel = 0; }
        var entityRetrive = getEntityNodes('new_indice', 'new_indiceid', id);
        var entityNodeRetrive = entityRetrive[0];
        var name = entityNodeRetrive.selectSingleNode("q1:new_name");
        name = name.text;
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = id;
        lookupItem.typename = 'new_indice';
        lookupItem.name = name;
        lookupData[0] = lookupItem;
        Xrm.Page.getAttribute("new_indiceid").setValue(lookupData);
        if (receitaVariavel == 1) {
            Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("required");
            Xrm.Page.getControl("new_receitavariavel").setDisabled(false);
        } else {
            Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_receitavariavel").setValue(null);
            Xrm.Page.getControl("new_receitavariavel").setDisabled(true);
        }
    } else {
        Xrm.Page.getAttribute("new_indiceid").setValue(null);
        Xrm.Page.getAttribute("new_receitavariavel").setValue(null);
        Xrm.Page.getControl("new_receitavariavel").setDisabled(true);
        Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none");
    }
    HideShowInfoContato();
}

function OnChange_new_databasereajuste() {
    if (Xrm.Page.getAttribute("new_databasereajuste").getValue() !== null) {
        var dataBase = Xrm.Page.getAttribute("new_databasereajuste").getValue();
        dataBase = dataBase.replace(/[^0-9]/g, '');
        if (dataBase.length == 6) {
            Xrm.Page.getAttribute("new_databasereajuste").setValue(dataBase.substr(0, 2) + '/' + dataBase.substr(2, 4));
        } else {
            alert("Dados incorretos. Ex.'05/2016'.");
            Xrm.Page.getAttribute("new_databasereajuste").setValue(null);
        }
    }
}

function OnChange_new_carnciadias() {
    if (Xrm.Page.getAttribute("new_activeon").getValue() == null) { Xrm.Page.getAttribute('billingstarton').setValue(null); }
    if ((Xrm.Page.getAttribute("new_activeon").getValue() !== null) && (Xrm.Page.getAttribute("new_carnciadias").getValue() !== null) && (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() !== 3)) {
        Xrm.Page.getAttribute('billingstarton').setValue(null);
        var carencia = Xrm.Page.getAttribute("new_carnciadias").getValue();
        var dias = 0;
        if (carencia >= 30) { carencia % 30; } else { dias = carencia; }
        var meses = carencia / 30;
        meses = parseInt(meses);
        aumentarData("billingstarton", "new_activeon", meses, "Mes");
        aumentarData("billingstarton", "billingstarton", dias, "Dia");
    }
    OnChange_new_condicaodevigencia();
}

function OnChange_new_prazodevigencia() {
    OnChange_activeon();
    OnChange_new_condicaodevigencia();
}

function OnChange_new_tipodegarantia() {
    TipoDeGarantia();
}

function OnChange_new_solicitarcontratocomerciallog() {
    /*
    if (Xrm.Page.getAttribute("new_solicitarcontratocomerciallog").getValue() == true) {
        if (CadastroCompleto() !== "OK") {
            //alert("Antes a conclusão da Oportunidade, favor completar o cadastro do Cliente.");
            Xrm.Page.getAttribute("new_datadasolicitaolog").setValue(null);
            Xrm.Page.getAttribute("new_solicitarcontratocomerciallog").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadasolicitaolog").setValue(new Date());
            Xrm.Page.getAttribute("new_datadasolicitaolog").setRequiredLevel("required");
        }
    } else {
        Xrm.Page.getAttribute("new_datadasolicitaolog").setValue(null);
    }*/
}

function OnChange_new_espelhodecontrato() {
    if (Xrm.Page.getAttribute("new_espelhodecontrato").getValue() == true) {
        if (CadastroCompleto() !== "OK") {
            alert("Antes do envio do Espelho ao Comercial favor completar o cadastro do Cliente.");
            Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            //Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("required");
        }
        if (VerificaDesconto() !== "OK") {
            alert("Antes do envio do Espelho ao Comercial favor preencher os Descontos.");
            Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            //Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("required");
        }
        if ((VerificaEscalonamento() !== "OK") || (ValidaEscalonamento() !== "OK")) {
            alert("Antes do envio do Espelho ao Comercial favor preencher os Dados do Aluguel Escalonado.");
            Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            //Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("required");
        }
        /*if (VerificaCDU() !== "OK") {
            alert("Antes do envio do Espelho ao Comercial favor preencher os Dados do CDU.");
            Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            // Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("required");
        }*/
        if (VerificaFiador() !== "OK") {
            alert("Antes do envio do Espelho ao Comercial favor preencher os Dados dos Fiadores.");
            Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
            Xrm.Page.getAttribute("new_espelhodecontrato").setValue(false);
        } else {
            Xrm.Page.getAttribute("new_datadoenvio").setValue(new Date());
            //Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("required");
        }
    } else {
        Xrm.Page.getAttribute("new_datadoenvio").setValue(null);
        Xrm.Page.getAttribute("new_datadoenvio").setRequiredLevel("none");
    }
}

function OnChange_customerid() {
    if (Xrm.Page.getAttribute("customerid").getValue() == null) {
        if (Xrm.Page.getAttribute("new_cd").getValue() !== 1) {
            Xrm.Page.getAttribute("new_propostaid").setValue(null);
            Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
            Xrm.Page.getAttribute("new_organizacaodevendas").setValue("");
            Xrm.Page.getAttribute("new_accountnumber").setValue('');
        }
    } else {
        var entityUserRetrive = getEntityNodes('account', 'accountid', Xrm.Page.getAttribute("customerid").getValue()[0].id);
        if (entityUserRetrive.length !== 0) {
            var entityNodeUserRetrive = entityUserRetrive[0];
            var accountNumber = entityNodeUserRetrive.selectSingleNode("q1:accountnumber");
            if (accountNumber !== null) { accountNumber = accountNumber.text; } else { accountNumber = ''; }
            Xrm.Page.getAttribute("new_accountnumber").setValue(accountNumber);
        } else {
            Xrm.Page.getAttribute("new_accountnumber").setValue('');
        }
    }
}

function OnChange_new_empreendimentoid() {
    if (Xrm.Page.getAttribute("new_propostaid").getValue() == null) {
        alert("Primeiro escolha a Proposta.");
        Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
    }
    if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('new_empreendimento', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var organizacaoDeVendas = entityNodeUserRetrive.selectSingleNode("q1:new_escritoriodevendas");
        if (organizacaoDeVendas !== null) { organizacaoDeVendas = organizacaoDeVendas.text } else { organizacaoDeVendas = ""; }
        Xrm.Page.getAttribute("new_organizacaodevendas").setValue(organizacaoDeVendas);
    } else {
        Xrm.Page.getAttribute("new_organizacaodevendas").setValue("");
    }
}

function OnChange_new_propostaid() {
    var carenciaDias = 0;
    var vigenciaMeses = null;
    var tipoGarantia = null;
    var valorGarantia = null;
    var valorMedio = null;
    var tituloProposta = null;
    var empreendimentoId = null;
    if (Xrm.Page.getAttribute("customerid").getValue() == null) {
        alert("Primeiro escolha o Cliente.");
        Xrm.Page.getAttribute("new_propostaid").setValue(null);
        Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
        Xrm.Page.getAttribute("new_organizacaodevendas").setValue("");
    }
    if (Xrm.Page.getAttribute("new_propostaid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('quote', 'quoteid', Xrm.Page.getAttribute("new_propostaid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var carenciaDias = entityNodeUserRetrive.selectSingleNode("q1:new_carencia");
        var vigenciaMeses = entityNodeUserRetrive.selectSingleNode("q1:new_vigenciacontratual");
        var tipoGarantia = entityNodeUserRetrive.selectSingleNode("q1:new_tipodegarantia");
        var valorGarantia = entityNodeUserRetrive.selectSingleNode("q1:new_valordagarantia");
        var valorMedio = entityNodeUserRetrive.selectSingleNode("q1:new_valormedio");
        var tituloProposta = entityNodeUserRetrive.selectSingleNode("q1:name");
        var empreendimentoId = entityNodeUserRetrive.selectSingleNode("q1:new_empreendimentoid");
        var obsGarantia = entityNodeUserRetrive.selectSingleNode("q1:new_observacaogarantia");
        var oportunidadeId = entityNodeUserRetrive.selectSingleNode("q1:opportunityid");
        if (oportunidadeId !== null) {
            oportunidadeId = oportunidadeId.text;
            var entityRetriveO = getEntityNodes('opportunity', 'opportunityid', oportunidadeId);
            var entityNodeRetriveO = entityRetriveO[0];
            var name = entityNodeRetriveO.selectSingleNode("q1:name");
            name = name.text;
            var lookupData = new Array();
            var lookupItem = new Object();
            lookupItem.id = oportunidadeId;
            lookupItem.typename = 'opportunity';
            lookupItem.name = name;
            lookupData[0] = lookupItem;
            Xrm.Page.getAttribute("new_oportunidadeid").setValue(lookupData);
        }
        if (carenciaDias !== null) { carenciaDias = carenciaDias.text; Xrm.Page.getAttribute("new_carnciadias").setValue((carenciaDias * 1)); } else { Xrm.Page.getAttribute("new_carnciadias").setValue(null); }
        if (vigenciaMeses !== null) { vigenciaMeses = vigenciaMeses.text; Xrm.Page.getAttribute("new_prazodevigencia").setValue((vigenciaMeses * 1)); } else { Xrm.Page.getAttribute("new_prazodevigencia").setValue(null); }
        if (tipoGarantia !== null) { tipoGarantia = tipoGarantia.text; Xrm.Page.getAttribute("new_tipodegarantia").setValue((tipoGarantia * 1)); } else { Xrm.Page.getAttribute("new_tipodegarantia").setValue(null); }
        if (valorGarantia !== null) { valorGarantia = valorGarantia.text; Xrm.Page.getAttribute("new_valordagarantia").setValue((valorGarantia * 1)); } else { Xrm.Page.getAttribute("new_valordagarantia").setValue(null); }
        if (tituloProposta !== null) { tituloProposta = tituloProposta.text; Xrm.Page.getAttribute("title").setValue(tituloProposta); } else { Xrm.Page.getAttribute("title").setValue(null); }
        if (obsGarantia !== null) { obsGarantia = obsGarantia.text; Xrm.Page.getAttribute("new_observacaodagarantia").setValue(obsGarantia); } else { Xrm.Page.getAttribute("new_observacaodagarantia").setValue(null); }
        if (empreendimentoId !== null) {
            empreendimentoId = empreendimentoId.text;
            var entityRetriveE = getEntityNodes('new_empreendimento', 'new_empreendimentoid', empreendimentoId);
            var entityNodeRetriveE = entityRetriveE[0];
            var name = entityNodeRetriveE.selectSingleNode("q1:new_name");
            name = name.text;
            var lookupData = new Array();
            var lookupItem = new Object();
            lookupItem.id = empreendimentoId;
            lookupItem.typename = 'new_empreendimento';
            lookupItem.name = name;
            lookupData[0] = lookupItem;
            Xrm.Page.getAttribute("new_empreendimentoid").setValue(lookupData);
            OnChange_new_empreendimentoid();
        } else {
            Xrm.Page.getAttribute("new_propostaid").setValue(null);
            Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
            Xrm.Page.getAttribute("new_organizacaodevendas").setValue("");
        }
    } else {
        Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
        Xrm.Page.getAttribute("new_organizacaodevendas").setValue("");
        Xrm.Page.getAttribute("new_carnciadias").setValue(null);
        Xrm.Page.getAttribute("new_prazodevigencia").setValue(null);
        Xrm.Page.getAttribute("new_tipodegarantia").setValue(null);
        Xrm.Page.getAttribute("new_valordagarantia").setValue(null);
        Xrm.Page.getAttribute("title").setValue(null);
        Xrm.Page.getAttribute("new_observacaodagarantia").setValue(null);
    }
    if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3) {
        Xrm.Page.getAttribute("new_carnciadias").setValue(null);
        Xrm.Page.getAttribute("new_prazodevigencia").setValue(null);
        Xrm.Page.getAttribute("new_tipodegarantia").setValue(7);
        Xrm.Page.getAttribute("new_valordagarantia").setValue(null);
        Xrm.Page.getAttribute("new_observacaodagarantia").setValue("Sem Garantia");
    }
    TipoDeGarantia();
    if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3) {
        Xrm.Page.getAttribute("new_carnciadias").setValue(0);
    }
}

function AlteraStatusDoItem(status) {
    if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodes('contractdetail', 'new_contratoid', Xrm.Page.data.entity.getId());
        if (entityRetrive.length !== 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var statusLinha = entityNodeRetrive.selectSingleNode("q1:new_statusdalinha");
                statusLinha = statusLinha.text;
                var idLinha = entityNodeRetrive.selectSingleNode("q1:contractdetailid");
                idLinha = idLinha.text;
                if (status == "1") {
                } else if (status == "2") {
                    if ((statusLinha == "1") || (statusLinha == "3")) {
                        setEntityNode("contractdetail", "contractdetailid", idLinha, "new_statusdalinha", 2, 0);
                    }
                } else if (status == "3") {
                    if (statusLinha == "2") {
                        setEntityNode("contractdetail", "contractdetailid", idLinha, "new_statusdalinha", 3, 0);
                    }
                } else if (status == "4") {
                    if ((statusLinha == "1") || (statusLinha == "2") || (statusLinha == "3")) {
                        setEntityNode("contractdetail", "contractdetailid", idLinha, "new_statusdalinha", 4, 0);
                    }
                }
            }
        }
    }
}

function ReativarModulosContratoCancelado() {
    /* if ((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 4) && (Xrm.Page.ui.getFormType() == 2)) {
         var entityRetrive = getEntityNodes('contractdetail', 'new_contratoid', Xrm.Page.data.entity.getId());
         if (entityRetrive.length !== 0) {
             for (x = 0; x < entityRetrive.length; x++) {
                 var entityNodeRetrive = entityRetrive[x];
                 var statusLinha = entityNodeRetrive.selectSingleNode("q1:new_statusdalinha");
                 statusLinha = statusLinha.text;
                 var idLinha = entityNodeRetrive.selectSingleNode("q1:contractdetailid");
                 idLinha = idLinha.text;
                 var idProduto = entityNodeRetrive.selectSingleNode("q1:productid");
                 idProduto = idProduto.text;
                 setEntityNode("product", "productid", idProduto, "statuscode", 1, 0);
                 setEntityNode("product", "productid", idProduto, "new_status", 1, 0);
             }
         }
     } else {
         alert("Opção disponível somente para Contratos Cancelados.");
         return false;
     }*/
}

function OnChange_new_garantiaentregue() {
    if (Xrm.Page.getAttribute("new_garantiaentregue").getValue() == true) {
        Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("required");
        Xrm.Page.getControl("new_datadaentregagarantia").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("new_datadaentregagarantia").setRequiredLevel("none");
        Xrm.Page.getControl("new_datadaentregagarantia").setDisabled(true);
    }
}

function VerificaDesconto() {
    var descontoOkError = "Error";
    if (Xrm.Page.getAttribute("new_desconto").getValue() == true) {
        if (Xrm.Page.ui.getFormType() == 2) {
            var entityRetrive = getEntityNodesDouble("new_descontocontrato", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
            if (entityRetrive.length != 0) { descontoOkError = "OK" }
        }
        return descontoOkError;
    } else { return "OK"; }
}

function VerificaFiador() {
    var fiadorOkError = "Error";
    if (Xrm.Page.getAttribute("new_tipodegarantia").getValue() == 1) {
        if (Xrm.Page.ui.getFormType() == 2) {
            var entityRetrive = getEntityNodesDouble("new_fiador", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
            if (entityRetrive.length != 0) { fiadorOkError = "OK" }
        }
        return fiadorOkError;
    } else { return "OK"; }
}

function VisivelAposAssinatura() {
    if ((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2) && (Xrm.Page.ui.getFormType() == 2)) {
        if ((Xrm.Page.getAttribute('new_garantiaentregue').getValue() == null) || (Xrm.Page.getAttribute('new_garantiaentregue').getValue() == false)) {
            Xrm.Page.getControl("new_garantiaentregue").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_datadaentregagarantia').getValue() == null) {
            Xrm.Page.getControl("new_datadaentregagarantia").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_valormedio').getValue() == null) {
            Xrm.Page.getControl("new_valormedio").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_dataentregadaschaves').getValue() == null) {
            Xrm.Page.getControl("new_dataentregadaschaves").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_datadavistoria').getValue() == null) {
            Xrm.Page.getControl("new_datadavistoria").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_termodeinauguracao').getValue() == null) {
            Xrm.Page.getControl("new_termodeinauguracao").setDisabled(false);
        }
        if (Xrm.Page.getAttribute('new_dataprevistaentregadaschaves').getValue() == null) {
            Xrm.Page.getControl("new_dataprevistaentregadaschaves").setDisabled(false);
        }
    }
}

function OnChange_new_enviadoparaassinatura() {
    if (VerificaCDU() == "OK") {
        if (Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true) {
            Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(new Date());
            //Xrm.Page.getAttribute("new_datadoenvioassinatura").setRequiredLevel("required");
            Xrm.Page.getAttribute('new_statusdocontrato').setValue(6);
            Xrm.Page.data.entity.save("save");
        } else {
            Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(null);
            //Xrm.Page.getAttribute("new_datadoenvioassinatura").setRequiredLevel("none");
        }
    } else {
        alert("Não Foram Localizados os Valores de CDU do Contrato e/ou a quantidade de parcelas e/ou o Valot Total do CDU não estão de acordo com o Contrato. Favor Verificar");
        Xrm.Page.getAttribute("new_enviadoparaassinatura").setValue(false);
        return false;
    }
}

function AluguelMedioMensal() {
    var aluguelMedio = 0;
    var aluquelBrutoNominalMensal = Xrm.Page.getAttribute("totalprice").getValue();
    if (aluquelBrutoNominalMensal == null) { aluquelBrutoNominalMensal = 0; }
    var aluquelBrutoNominalDiario = 0;
    if (aluquelBrutoNominalMensal > 0) { aluquelBrutoNominalDiario = aluquelBrutoNominalMensal / 30; }
    var DiasCarencia = Xrm.Page.getAttribute("new_carnciadias").getValue();
    if (DiasCarencia == null) { DiasCarencia = 0; }
    var valorCarencia = 0;
    if ((aluquelBrutoNominalMensal > 0) && (DiasCarencia > 0)) { valorCarencia = DiasCarencia * aluquelBrutoNominalDiario; }
    var vigenciaMeses = Xrm.Page.getAttribute("new_prazodevigencia").getValue();
    if (vigenciaMeses == null) { vigenciaMeses = 0; }
    var valorDescontoTotal = 0;
    if (Xrm.Page.getAttribute("new_desconto").getValue() == true) {
        if (Xrm.Page.ui.getFormType() == 2) {
            var entityRetrive = getEntityNodesDouble("new_descontocontrato", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
            if (entityRetrive.length !== 0) {
                for (x = 0; x < entityRetrive.length; x++) {
                    var entityNodeRetrive = entityRetrive[x];
                    var quantidadeMeses = entityNodeRetrive.selectSingleNode("q1:new_quantidademeses");
                    if (quantidadeMeses !== null) { quantidadeMeses = quantidadeMeses.text; } else { quantidadeMeses = 0; }
                    var descontoPercentual = entityNodeRetrive.selectSingleNode("q1:new_desconto");
                    if (descontoPercentual !== null) { descontoPercentual = descontoPercentual.text; } else { descontoPercentual = 0; }
                    var descontoValor = entityNodeRetrive.selectSingleNode("q1:new_descontovalor");
                    if (descontoValor !== null) { descontoValor = descontoValor.text; } else { descontoValor = 0; }
                    valorDescontoTotal += (((descontoPercentual / 100) * aluquelBrutoNominalMensal * quantidadeMeses) + (quantidadeMeses * descontoValor));
                }
            }
        }
    }
    aluguelMedio = (((aluquelBrutoNominalMensal * vigenciaMeses) - (parseFloat(valorCarencia) + parseFloat(valorDescontoTotal))) / vigenciaMeses);
    if (aluguelMedio > 0) { Xrm.Page.getAttribute("new_valormedio").setValue(parseFloat(aluguelMedio)); } else { Xrm.Page.getAttribute("new_valormedio").setValue(0); }
}

function OnChange_new_multaescalonada() {
    if (Xrm.Page.getAttribute("new_multaescalonada").getValue() == 1) {
        Xrm.Page.getAttribute("new_dias").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_multaesctexto").setRequiredLevel("required");
        Xrm.Page.getControl("new_dias").setVisible(true);
        Xrm.Page.getControl("new_multaesctexto").setVisible(true);

    } else {
        Xrm.Page.getAttribute("new_dias").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_multaesctexto").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_dias").setValue(null);
        Xrm.Page.getAttribute("new_multaesctexto").setValue(null);
        Xrm.Page.getControl("new_dias").setVisible(false);
        Xrm.Page.getControl("new_multaesctexto").setVisible(false);
    }
}

function OnChange_new_desconto() {
    HideShowInfoContato();
}

function OnChnage_new_aluguelescalonado() {
    HideShowInfoContato();
}

function VerificaCDU() {
    var descontoOkError = "Error";
    var valorTotal = 0;
    var valorCDUContrato = 0;
    if (Xrm.Page.getAttribute("new_valorcdu").getValue() !== null) { valorCDUContrato = Xrm.Page.getAttribute("new_valorcdu").getValue(); }
    var resultado = 0;
    var qtdParcelas = 0;
    if (Xrm.Page.getAttribute("new_noparcelascdu").getValue() !== null) { qtdParcelas = Xrm.Page.getAttribute("new_noparcelascdu").getValue(); }
    var resto = 0;
    if (Xrm.Page.getAttribute("new_cdu").getValue() == 1) {
        if (Xrm.Page.ui.getFormType() == 2) {
            var entityRetrive = getEntityNodesDouble("new_cdu", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
            if (entityRetrive.length != 0) {
                for (x = 0; x < entityRetrive.length; x++) {
                    var entityNodeRetriveCDU = entityRetrive[x];
                    var valorTotalCDU = entityNodeRetriveCDU.selectSingleNode("q1:new_valor");
                    if (valorTotalCDU != null) { valorTotalCDU = valorTotalCDU.text; } else { valorTotalCDU = 0; }
                    valorTotal += parseFloat(valorTotalCDU);
                }
            } else { descontoOkError = "Error"; }
            resultado = parseFloat(valorCDUContrato.toFixed(2)) - parseFloat(valorTotal.toFixed(2));
            resto = 0.01 * parseInt(qtdParcelas);
            if (
                (entityRetrive.length == parseInt(qtdParcelas)) &&
                (
                (parseFloat(valorTotal.toFixed(2)) == parseFloat(valorCDUContrato.toFixed(2))) ||
                (parseFloat(resto.toFixed(2)) > parseFloat(resultado.toFixed(2)))
                )
                ) {
                descontoOkError = "OK";
            } else { descontoOkError = "Error"; }
        } else { descontoOkError = "Error"; }
    } else { descontoOkError = "OK"; }
    return descontoOkError;
}

function VerificaEscalonamento() {
    var descontoOkError = "Error";
    if (Xrm.Page.getAttribute("new_aluguelescalonado").getValue() == 1) {
        if (Xrm.Page.ui.getFormType() == 2) {
            var entityRetrive = getEntityNodesDouble("new_aluguelescalonado", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
            if (entityRetrive.length != 0) { descontoOkError = "OK" }
        }
        return descontoOkError;
    } else { descontoOkError = "OK"; }
    return descontoOkError;
}

function ValidaEscalonamento() {
    var quantidadeTotal = 0;
    if ((Xrm.Page.getAttribute("new_aluguelescalonado").getValue() == "1") && (Xrm.Page.ui.getFormType() == 2)) {
        var entityRetrive = getEntityNodesDouble("new_aluguelescalonado", "new_contratoid", Xrm.Page.data.entity.getId(), "statecode", "Active");
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var quantidade = entityNodeRetrive.selectSingleNode("q1:new_quantidade");
                if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
                quantidadeTotal += (quantidade * 1);
            }
        }
        if (parseInt(quantidadeTotal) == Xrm.Page.getAttribute("new_prazodevigencia").getValue()) {
            return "OK";
        } else { return "Error"; }
    } else { return "OK"; }
}

function HideShowInfoContato() {
    if (Xrm.Page.getAttribute("new_tipodegarantia").getValue() == 1) {
        Xrm.Page.ui.tabs.get()[4].setVisible(true);
        Xrm.Page.ui.tabs.get(4).setDisplayState('expanded');
    } else { Xrm.Page.ui.tabs.get()[4].setVisible(false); }

    if (Xrm.Page.getAttribute("new_desconto").getValue() == true) {
        Xrm.Page.ui.tabs.get()[5].setVisible(true);
        Xrm.Page.ui.tabs.get(5).setDisplayState('expanded');
    } else { Xrm.Page.ui.tabs.get()[5].setVisible(false); }

    if (Xrm.Page.getAttribute("new_aluguelescalonado").getValue() == 1) {
        Xrm.Page.ui.tabs.get()[6].setVisible(true);
        Xrm.Page.ui.tabs.get(6).setDisplayState('expanded');
    } else { Xrm.Page.ui.tabs.get()[6].setVisible(false); }

    if (Xrm.Page.getAttribute("new_tipodecontratoid").getValue() !== null) {
        var entityUserRetrive = getEntityNodesDouble('new_tipodecontrato', 'new_tipodecontratoid', Xrm.Page.getAttribute("new_tipodecontratoid").getValue()[0].id, "new_receitavariavel", 1);
        if (entityUserRetrive.length !== 0) {
            Xrm.Page.ui.tabs.get()[7].setVisible(true);
            Xrm.Page.ui.tabs.get(7).setDisplayState('expanded');
        } else { Xrm.Page.ui.tabs.get()[7].setVisible(false); }
    } else { Xrm.Page.ui.tabs.get()[7].setVisible(false); }

    if (Xrm.Page.getAttribute('new_cdu').getValue() == 1) {
        Xrm.Page.ui.tabs.get()[3].setVisible(true);
        Xrm.Page.ui.tabs.get(3).setDisplayState('expanded');
    } else { Xrm.Page.ui.tabs.get()[3].setVisible(false); }
}

function OnChange_new_cdu() {
    if (Xrm.Page.getAttribute('new_cdu').getValue() == 1) {
        Xrm.Page.ui.tabs.get()[3].setVisible(true);
        Xrm.Page.ui.tabs.get(3).setDisplayState('expanded');
        Xrm.Page.ui.tabs.get('general').sections.get('general_section_espelho').setVisible(false);
        Xrm.Page.getAttribute("new_carnciadias").setValue(0);
        Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("none");
    } else {
        Xrm.Page.ui.tabs.get()[3].setVisible(false);
        Xrm.Page.ui.tabs.get('general').sections.get('general_section_espelho').setVisible(true);
        Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("required");
    }
}

function ValidaTextoParaInteiro(atrigutoOrigem, atributoDestino) {
    if (Xrm.Page.getAttribute(atrigutoOrigem).getValue() !== null) {
        var _texto = Xrm.Page.getAttribute(atrigutoOrigem).getValue();
        var attributFormNew = _texto.replace(/[^0-9]/g, '');
        if (_texto.length !== attributFormNew.length) {
            alert("Esse campo só aceita números Inteiros.");
            Xrm.Page.getAttribute(atrigutoOrigem).setValue(null);
            Xrm.Page.getAttribute(atributoDestino).setValue(null);
            Xrm.Page.getControl(atrigutoOrigem).setFocus(true);
        } else {
            Xrm.Page.getAttribute(atributoDestino).setValue(parseInt(attributFormNew));
        }
    } else {
        Xrm.Page.getAttribute(atributoDestino).getValue(null);
    }
}

// 1 - Rascunho 2 - Assinado 3 - Suspenso 4 - Cancelado
/******************************************************/
/*                                                    */
/*                 Botões do Contrato                 */
/*                                                    */
/* Ref:$webresource:new_contract_main_library         */
/*                                                    */
/******************************************************/

function AssinarContrato() {
    if ((currentUserHasRole('Comercial LOG') == true) || (currentUserHasRole('Administrador do Sistema') == true)) {
        if (Xrm.Page.getAttribute('new_databasereajuste').getValue() !== null) {
            if (VerificaCDU() == "OK") {
                if (VerificaFiador() == "OK") {
                    if ((VerificaEscalonamento() == "OK") && (ValidaEscalonamento() == "OK")) {
                        if (VerificaDesconto() == "OK") {
                            if (
                                    (Xrm.Page.getAttribute('new_analisejuridica').getValue() !== 5) &&
                                    (Xrm.Page.getAttribute('new_analisejuridica').getValue() !== 2) &&
                                    (Xrm.Page.getAttribute('new_analisecadastral').getValue() !== 5) &&
                                    (Xrm.Page.getAttribute('new_analisecadastral').getValue() !== 2) &&
                                    (Xrm.Page.getAttribute('new_analisedecredito').getValue() !== 5) &&
                                    (Xrm.Page.getAttribute('new_analisedecredito').getValue() !== 2)
                               ) {
                                if (((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 3) || (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 6)) && (Xrm.Page.ui.getFormType() == 2)) {
                                    var entityRetrive = getEntityNodes('contractdetail', 'new_contratoid', Xrm.Page.data.entity.getId());
                                    if ((entityRetrive.length == 0) && (Xrm.Page.getAttribute("new_tipodecontrato").getValue() !== 3)) {
                                        alert("Contratos sem Linhas não podem ser Assinados.");
                                        return false;
                                    }
                                    if (Xrm.Page.getAttribute('new_datadaassinatura').getValue() == null) {
                                        Xrm.Page.getAttribute("new_datadaassinatura").setRequiredLevel("required");
                                        alert("Preencha a Data da Assinatura do Contrato.");
                                        return false;
                                    }
                                    if (CadastroCompleto() !== "OK") {
                                        alert("Antes a Assinatura do Contrato, favor completar o cadastro do Cliente.");
                                        return false;
                                    }
                                    AlteraOpotunidadeAberta();
                                    Xrm.Page.getAttribute('new_statusdocontrato').setValue(2);
                                    Xrm.Page.getControl("new_statusdocontrato").setDisabled(false);
                                    Xrm.Page.getControl("new_salvar").setDisabled(false);
                                    AlteraStatusDoItem(2);
                                    /*Altera Produto*/
                                    var entityRetrive = getEntityNodes('contractdetail', 'new_contratoid', Xrm.Page.data.entity.getId());
                                    if (entityRetrive.length !== 0) {
                                        for (x = 0; x < entityRetrive.length; x++) {
                                            var entityNodeRetrive = entityRetrive[x];
                                            var statusLinha = entityNodeRetrive.selectSingleNode("q1:new_statusdalinha");
                                            statusLinha = statusLinha.text;
                                            var idLinha = entityNodeRetrive.selectSingleNode("q1:contractdetailid");
                                            idLinha = idLinha.text;
                                            var idProduto = entityNodeRetrive.selectSingleNode("q1:productid");
                                            idProduto = idProduto.text;
                                            if (statusLinha !== 4) {
                                                setEntityNode("product", "productid", idProduto, "statuscode", 100000001, 0);
                                                setEntityNode("product", "productid", idProduto, "new_status", 3, 0);
                                            }
                                        }
                                    }
                                    Xrm.Page.getAttribute("new_datadasolicitaolog").setValue(new Date());
                                    Xrm.Page.getAttribute("new_datadasolicitaolog").setValue(true);
                                    OnChange_new_condicaodevigencia();
                                    Xrm.Page.data.entity.save("saveandclose");
                                } else {
                                    alert("Somente Contratos em Em Assinatura podem ser Assinados ou Contratos Suspenso podem ser Reativados");
                                    return false;
                                }
                            } else {
                                alert("Existe pendências de Parecer. Favor Verificar");
                                return false;
                            }
                        } else {
                            alert("Não Foram Localizados os Descontos do Contrato. Favor Verificar");
                            return false;
                        }
                    } else {
                        alert("Não Foram Localizados as Informações do Aluguel Escalonado no Contrato ou essa informações estão Incorretas. Favor Verificar");
                        return false;
                    }
                } else {
                    alert("Não Foram Localizados os Fiadores do Contrato. Favor Verificar");
                    return false;
                }
            } else {
                alert("Não Foram Localizados os Valores de CDU do Contrato e/ou a quantidade de parcelas e/ou o Valot Total do CDU não estão de acordo com o Contrato. Favor Verificar");
                return false;
            }
        } else {
            alert("A Data Base do Reajuste não foi preenchida. Favor Verificar");
            Xrm.Page.getControl("new_databasereajuste").setFocus(true);
            return false;
        }
    } else {
        alert("Você não tem premissão para executar essa operação. Contate o Administrador");
        return false;
    }
}

function CancelarContrato() {
    if ((currentUserHasRole('Comercial LOG') == true) || (currentUserHasRole('Administrador do Sistema') == true)) {
        //if (((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 1) || (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2) || (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 3)) && (Xrm.Page.ui.getFormType() == 2)) {
        if (((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 1) || (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 6)) && (Xrm.Page.ui.getFormType() == 2)) {
            Xrm.Page.getAttribute('new_statusdocontrato').setValue(4);
            Xrm.Page.getControl("new_statusdocontrato").setDisabled(false);
            Xrm.Page.getControl("new_salvar").setDisabled(false);
            AlteraStatusDoItem(4);
            //Reativa Itens cancelados
            //  if (Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2) {
            //  if (confirm("Deseja ativar os Módulos existentes na Linha do Contrato para Realocação?")) {
            //      ReativarModulosContratoCancelado();
            //   }
            //}
            Xrm.Page.data.entity.save("saveandclose");
        } else {
            //alert("Somente Contratos em Rascunho,Assinados ou Contratos Suspenso podem ser Cancelados");
            alert("Somente Contratos em Rascunho ou Em Assinatura podem ser Cancelados");
            return false;
        }
    } else {
        alert("Você não tem premissão para executar essa operação. Contate o Administrador");
        return false;
    }
}

function SuspenderContrato() {
    if ((currentUserHasRole('Comercial LOG') == true) || (currentUserHasRole('Administrador do Sistema') == true)) {
        if ((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 2) && (Xrm.Page.ui.getFormType() == 2)) {
            Xrm.Page.getAttribute('new_statusdocontrato').setValue(3);
            Xrm.Page.getControl("new_statusdocontrato").setDisabled(false);
            Xrm.Page.getControl("new_salvar").setDisabled(false);
            AlteraStatusDoItem(3);
            Xrm.Page.data.entity.save("saveandclose");
        } else {
            alert("Somente Contratos Assinados podem ser Suspensos");
            return false;
        }
    } else {
        alert("Você não tem premissão para executar essa operação. Contate o Administrador");
        return false;
    }
}

function PropostaParaContrato() {
    /*if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 1) {*/
    if ((Xrm.Page.getAttribute('new_produtoinserido').getValue() == false) || (Xrm.Page.getAttribute('new_produtoinserido').getValue() == null)) {
        if (((Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 1) || Xrm.Page.getAttribute('new_statusdocontrato').getValue() == 6) && (Xrm.Page.ui.getFormType() == 2) && (Xrm.Page.getAttribute('new_propostaid').getValue() !== null)) {
            var entityRetriveI = getEntityNodes("quotedetail", "quoteid", Xrm.Page.getAttribute('new_propostaid').getValue()[0].id);
            if (entityRetriveI.length != 0) {
                for (x = 0; x < entityRetriveI.length; x++) {
                    var entityNodeRetriveI = entityRetriveI[x];
                    var produtoid = entityNodeRetriveI.selectSingleNode("q1:productid");
                    produtoid = produtoid.text;
                    var quntidade = entityNodeRetriveI.selectSingleNode("q1:quantity");
                    quntidade = quntidade.text;
                    var precoNegociado = entityNodeRetriveI.selectSingleNode("q1:priceperunit");
                    precoNegociado = precoNegociado.text;
                    var unidadeId = entityNodeRetriveI.selectSingleNode("q1:uomid");
                    unidadeId = unidadeId.text;
                    var dataInicio = Xrm.Page.getAttribute('activeon').getValue();
                    dataInicio = (dataInicio.getMonth() + 1) + '/' + dataInicio.getDate() + '/' + dataInicio.getFullYear();
                    var dataFim = Xrm.Page.getAttribute('expireson').getValue();
                    dataFim = (dataFim.getMonth() + 1) + '/' + dataFim.getDate() + '/' + dataFim.getFullYear();
                    var empreendimentoId = Xrm.Page.getAttribute('new_empreendimentoid').getValue()[0].id;
                    var entityRetriveP = getEntityNodesTree("contractdetail", "productid", produtoid, "new_statusdalinha", 1, 'new_contratoid', Xrm.Page.data.entity.getId());
                    if (entityRetriveP.length == 0) {
                        CreateContractDetail(empreendimentoId, produtoid, quntidade, unidadeId, precoNegociado, (precoNegociado * quntidade), Xrm.Page.data.entity.getId(), dataInicio, dataFim);
                    }
                }
                alert("Produtos Importados com Sucesso. Favor completar os Dados das Linhas Importadas");
                Xrm.Page.getAttribute('new_produtoinserido').setValue(true);
                Xrm.Page.data.entity.save("save");
            }
        } else {
            alert("Buscar dados da Proposta está disponível para Contratos Rascunho.");
            return false;
        }
    } else {
        alert("Produtos da Prosposta ja foram inserido no Contrato.");
        return false;
    }
    /*} else {
         alert("Opção indisponível para Contratos CDU e/ou Aditivo.");
         return false;
     }*/
}


function OnChange_activeon() {
    Xrm.Page.getAttribute('new_expireson').setValue(null);
    Xrm.Page.getAttribute('billingendon').setValue(null);
    if (Xrm.Page.getAttribute("new_activeon").getValue() == null) { Xrm.Page.getAttribute('billingstarton').setValue(null); }
    if ((Xrm.Page.getAttribute("new_activeon").getValue() !== null) && (Xrm.Page.getAttribute("new_prazodevigencia").getValue() !== null)) {
        aumentarData("new_expireson", "new_activeon", Xrm.Page.getAttribute('new_prazodevigencia').getValue(), "Mes");
        aumentarData("billingendon", "new_activeon", Xrm.Page.getAttribute('new_prazodevigencia').getValue(), "Mes");
    }
    if ((Xrm.Page.getAttribute("new_activeon").getValue() !== null) && (Xrm.Page.getAttribute("new_carnciadias").getValue() !== null) && (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() !== 3)) {
        Xrm.Page.getAttribute('billingstarton').setValue(null);
        var carencia = Xrm.Page.getAttribute("new_carnciadias").getValue();
        var dias = 0;
        if (carencia >= 30) { dias = carencia % 30; } else { dias = carencia; }
        var meses = carencia / 30;
        meses = parseInt(meses);
        dias = parseInt(dias);
        aumentarData("billingstarton", "new_activeon", meses, "Mes");
        aumentarData("billingstarton", "billingstarton", dias, "Dia");
    }
}

function OnChange_new_condicaodevigencia() {
    Xrm.Page.getAttribute("new_activeon").setRequiredLevel("none");
    if (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() == 1) { //Assinatura do Contrato
        Xrm.Page.getControl("new_activeon").setDisabled(true);
        Xrm.Page.getAttribute('new_activeon').setValue(Xrm.Page.getAttribute('new_datadaassinatura').getValue());
        Xrm.Page.getAttribute("new_condicao").setRequiredLevel("none");
        Xrm.Page.getControl("new_condicao").setVisible(false);
    } else if (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() == 2) { //Entrega das Chaves
        Xrm.Page.getControl("new_activeon").setDisabled(true);
        Xrm.Page.getAttribute('new_activeon').setValue(Xrm.Page.getAttribute('new_dataentregadaschaves').getValue());
        Xrm.Page.getAttribute("new_condicao").setRequiredLevel("none");
        Xrm.Page.getControl("new_condicao").setVisible(false);
    } else if (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() == 3) {//Termo de Inauguração
        Xrm.Page.getControl("new_activeon").setDisabled(true);
        var carencia = 0;
        var dias = 0;
        if (Xrm.Page.getAttribute("new_carnciadias").getValue() !== null) { carencia = Xrm.Page.getAttribute("new_carnciadias").getValue(); }
        if (carencia >= 30) { dias = carencia % 30; } else { dias = carencia; }
        var meses = carencia / 30;
        meses = parseInt(meses);
        dias = parseInt(dias);
        if (Xrm.Page.getAttribute('new_dataentregadaschaves').getValue() !== null) {
            var entregaChaves = Xrm.Page.getAttribute("new_dataentregadaschaves").getValue();
            var entregaFinal = new Date(entregaChaves);
            entregaFinal.setMonth(entregaChaves.getMonth() + meses);
            entregaFinal.setDate(entregaFinal.getDate() + dias);
            if (Xrm.Page.getAttribute('new_termodeinauguracao').getValue() !== null) {
                var termoInauguracao = Xrm.Page.getAttribute("new_termodeinauguracao").getValue();
                Xrm.Page.getAttribute('new_data1').setValue(new Date(entregaFinal));
                Xrm.Page.getAttribute('new_data2').setValue(new Date(termoInauguracao))
                if (Xrm.Page.getAttribute('new_data1').getValue() < Xrm.Page.getAttribute('new_data2').getValue()) {
                    aumentarData("new_activeon", "new_dataentregadaschaves", meses, "Mes");
                    aumentarData("new_activeon", "new_activeon", dias, "Dia");
                } else {
                    Xrm.Page.getAttribute('new_activeon').setValue(Xrm.Page.getAttribute("new_termodeinauguracao").getValue());
                }
            } else {
                Xrm.Page.getAttribute('new_data2').setValue(new Date())
                if (Xrm.Page.getAttribute('new_data1').getValue() < Xrm.Page.getAttribute('new_data2').getValue()) {
                    aumentarData("new_activeon", "new_dataentregadaschaves", meses, "Mes");
                    aumentarData("new_activeon", "new_activeon", dias, "Dia");
                } else { Xrm.Page.getAttribute('new_activeon').setValue(null); }
            }
        } else { Xrm.Page.getAttribute('new_activeon').setValue(null); }
        Xrm.Page.getAttribute('billingstarton').setValue(Xrm.Page.getAttribute('new_activeon').getValue());
        Xrm.Page.getAttribute("new_condicao").setRequiredLevel("none");
        Xrm.Page.getControl("new_condicao").setVisible(false);
    } else if (Xrm.Page.getAttribute('new_condicaodevigencia').getValue() == 4) { //outros
        Xrm.Page.getControl("new_activeon").setDisabled(false);
        Xrm.Page.getAttribute("new_activeon").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_condicao").setRequiredLevel("required");
        Xrm.Page.getControl("new_condicao").setVisible(true);
    } else {//Sem
        Xrm.Page.getControl("new_activeon").setDisabled(true);
        Xrm.Page.getAttribute("new_activeon").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_condicao").setRequiredLevel("none");
        Xrm.Page.getControl("new_condicao").setVisible(false);
    }
    OnChange_activeon();
}

function OnChange_new_dataentregadaschaves() {
    OnChange_new_condicaodevigencia();
}

function OnChange_new_termodeinauguracao() {
    OnChange_new_condicaodevigencia();
}

function ContratoCDU() {
    if (Xrm.Page.ui.getFormType() == 1) {
        if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3) {
            Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_tipodegarantia").setValue(7);
            Xrm.Page.getAttribute("new_observacaodagarantia").setValue("Contrato CDU. Não Possui Garantia.");
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(false);
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_6').setVisible(false);
            Xrm.Page.getControl("new_prazodevigencia").setVisible(false);
            Xrm.Page.getControl("new_noparcelascdu").setVisible(true);
            Xrm.Page.getAttribute('new_cdu').setValue(1);
            Xrm.Page.getAttribute("new_noparcelascdu").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_prazodevigencia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_6').setVisible(false);
            Xrm.Page.getAttribute('new_vencimentomescorrente').setValue(1);
            Xrm.Page.getAttribute('new_cancelamentodesconto').setValue(0);
            Xrm.Page.getAttribute('new_carnciadias').setValue(0);
            Xrm.Page.getControl("new_carnciadias").setVisible(false);
            Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_multaescalonada").setValue(0);
            Xrm.Page.getControl("new_multaescalonada").setVisible(false);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_8').setVisible(false);
            Xrm.Page.getAttribute("new_aluguelescalonado").setValue(0);
            Xrm.Page.getControl("new_aluguelescalonado").setVisible(false);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('pricing').setVisible(false);
            Xrm.Page.ui.tabs.get()[2].setVisible(false);
            Xrm.Page.getAttribute("new_valorcdu").setRequiredLevel("required");
            Xrm.Page.getControl("new_multarescisoriat").setVisible(false);
            Xrm.Page.getAttribute("new_diadevencimento").setRequiredLevel("none");
        } else {
            Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_diadevencimento").setRequiredLevel("required");
            Xrm.Page.getControl("new_multarescisoriat").setVisible(true);
            Xrm.Page.getAttribute("new_tipodegarantia").setValue(null);
            Xrm.Page.getAttribute("new_observacaodagarantia").setValue(null);
            Xrm.Page.getAttribute("new_aluguelescalonado").setValue(null);
            Xrm.Page.getAttribute("new_multaescalonada").setValue(null);
            Xrm.Page.getAttribute('new_vencimentomescorrente').setValue(null);
            Xrm.Page.getAttribute('new_cancelamentodesconto').setValue(null);
            Xrm.Page.getAttribute('new_carnciadias').setValue(null);
            Xrm.Page.getAttribute("new_prazodevigencia").setValue(null);
            Xrm.Page.getAttribute("new_noparcelascdu").setValue(null);
            Xrm.Page.getAttribute('new_cdu').setValue(0);
            Xrm.Page.getControl("new_prazodevigencia").setVisible(true);
            Xrm.Page.getControl("new_noparcelascdu").setVisible(false);
            OnChange_new_tipodegarantia();
            Xrm.Page.getAttribute("new_noparcelascdu").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_prazodevigencia").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_6').setVisible(true);
            Xrm.Page.getControl("new_carnciadias").setVisible(true);
            Xrm.Page.getControl("new_multaescalonada").setVisible(true);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_8').setVisible(true);
            Xrm.Page.getControl("new_aluguelescalonado").setVisible(true);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('pricing').setVisible(true);
            Xrm.Page.ui.tabs.get()[2].setVisible(true);
            Xrm.Page.getAttribute("new_valorcdu").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_valorcdu").setValue(null);
            OnChange_new_propostaid();
        }
    } else if (Xrm.Page.ui.getFormType() == 2) {
        if (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3) {
            Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_diadevencimento").setRequiredLevel("none");
            Xrm.Page.getControl("new_multarescisoriat").setVisible(false);
            Xrm.Page.getAttribute("new_receitavariavel").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_obs_garantia').setVisible(false);
            Xrm.Page.ui.tabs.get('general').sections.get('general_section_6').setVisible(false);
            Xrm.Page.getControl("new_prazodevigencia").setVisible(false);
            Xrm.Page.getControl("new_noparcelascdu").setVisible(true);
            Xrm.Page.getAttribute("new_noparcelascdu").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_prazodevigencia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_6').setVisible(false);
            Xrm.Page.getControl("new_carnciadias").setVisible(false);
            Xrm.Page.getControl("new_multaescalonada").setVisible(false);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_8').setVisible(false);
            Xrm.Page.getControl("new_aluguelescalonado").setVisible(false);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('pricing').setVisible(false);
            Xrm.Page.ui.tabs.get()[2].setVisible(false);
            Xrm.Page.getAttribute("new_valorcdu").setRequiredLevel("required");
        } else {
            OnChange_new_tipodegarantia();
            Xrm.Page.getAttribute("new_diadevencimento").setRequiredLevel("required");
            Xrm.Page.getControl("new_multarescisoriat").setVisible(true);
            Xrm.Page.getControl("new_prazodevigencia").setVisible(true);
            Xrm.Page.getControl("new_noparcelascdu").setVisible(false);
            Xrm.Page.getAttribute("new_noparcelascdu").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_prazodevigencia").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_6').setVisible(true);
            Xrm.Page.getControl("new_carnciadias").setVisible(true);
            Xrm.Page.getControl("new_multaescalonada").setVisible(true);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('tab_5_section_8').setVisible(true);
            Xrm.Page.getControl("new_aluguelescalonado").setVisible(true);
            Xrm.Page.ui.tabs.get('tab_5').sections.get('pricing').setVisible(true);
            Xrm.Page.ui.tabs.get()[2].setVisible(true);
            Xrm.Page.getAttribute("new_valorcdu").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_carnciadias").setRequiredLevel("required");
        }
    }
    if ((Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 2) || (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 3)) {
        Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("required");
        Xrm.Page.getControl("originatingcontract").setDisabled(false);
    } else {
        Xrm.Page.getAttribute("originatingcontract").setRequiredLevel("none");
        Xrm.Page.getAttribute("originatingcontract").setValue(null);
        Xrm.Page.getControl("originatingcontract").setDisabled(true);
    }
    OnChange_new_cdu();
}

function OnChange_new_noparcelascdu() {
    Xrm.Page.getAttribute("new_prazodevigencia").setValue(Xrm.Page.getAttribute("new_noparcelascdu").getValue());
}

function ComplementoDoAditivo() {
    if ((Xrm.Page.ui.getFormType() !== 1) && (Xrm.Page.getAttribute("new_tipodecontrato").getValue() == 2)) {
        Xrm.Page.ui.tabs.get('general').sections.get('general_section_aditivo').setVisible(true);
        OnChange_new_cd();
    } else {
        Xrm.Page.ui.tabs.get('general').sections.get('general_section_aditivo').setVisible(false);
    }
}

function OnChange_new_cd() {
    if (Xrm.Page.getAttribute("new_cd").getValue() == 1) {
        Xrm.Page.getControl("customerid").setDisabled(false);
    } else {
        if (Xrm.Page.ui.getFormType() == 2) {
            Xrm.Page.getControl("customerid").setDisabled(true);
        }
    }
    StatusDoContrato();
}