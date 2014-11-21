/*****************************************************************/
/*          Códigos Java Scritp's Entidade Distrato              */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 06/10/2014                                    */
/*          Versão: 3.0                                          */
/*****************************************************************/

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

function OnSave_new_distrato(prmContext) {
    if (prmContext != null && prmContext.getEventArgs() != null) {
        var wod_SaveMode = prmContext.getEventArgs().getSaveMode();
    }
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
    Xrm.Page.getControl("new_solicitacaodedistratolog").setDisabled(false);
    Xrm.Page.getControl("new_datadasolicitacao").setDisabled(false);
    Xrm.Page.getControl("new_statusdasolicitacaodedistratos").setDisabled(false);
    Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
    Xrm.Page.getControl("new_clienteid").setDisabled(false);
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
    Xrm.Page.getControl("new_contratoid").setDisabled(false);
    Xrm.Page.getControl("new_linhadocontratoid").setDisabled(false);
    Xrm.Page.getControl("new_salvar").setDisabled(false);
    Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(false);
    Xrm.Page.getControl("new_enviadoparaassinatura").setDisabled(false);
    forceSave("new_salvar");
}

function OnChange_new_enviadoparaassinatura() {
    if (Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true) {
        Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(new Date());
        Xrm.Page.getAttribute("new_datadoenvioassinatura").setRequiredLevel("required");
        Xrm.Page.getAttribute('new_statusdasolicitacaodedistratos').setValue(6);
        Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(false);
        Xrm.Page.data.entity.save("save");
    } else {
        Xrm.Page.getAttribute("new_datadoenvioassinatura").setValue(null);
        Xrm.Page.getAttribute("new_datadoenvioassinatura").setRequiredLevel("none");
        Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(true);
    }
}

function OnLoad_new_distrato() {
    if (Xrm.Page.ui.getFormType() == 2) {
        if (Xrm.Page.getAttribute("new_vistoriafeita").getValue() == true) {
            Xrm.Page.getAttribute("new_datadavistoria").setRequiredLevel("required");
        } else {
            Xrm.Page.getAttribute("new_datadavistoria").setRequiredLevel("none");
        }
        OnChange_new_responsavelpelareforma();
        if (Xrm.Page.getAttribute("new_isentodemultas").getValue() == false) {
            Xrm.Page.getAttribute("new_formadepagamentodemultas").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_valordamulta").setRequiredLevel("required");
        } else {
            Xrm.Page.getAttribute("new_formadepagamentodemultas").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_valordamulta").setRequiredLevel("none");
        }
        Xrm.Page.getControl("new_contratoid").setDisabled(true);
        Xrm.Page.getControl("new_linhadocontratoid").setDisabled(true);
        if (Xrm.Page.getAttribute("new_statusdasolicitacaodedistratos").getValue() !== 1) {
            DisabledAllRecording();
        }
        if (Xrm.Page.getAttribute("new_enviadoparaassinatura").getValue() == true) {
            Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(true);
            Xrm.Page.getControl("new_enviadoparaassinatura").setDisabled(true);
        } else {
            Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(false);
        }
    } else if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getControl("new_linhadocontratoid").setDisabled(true);
        Xrm.Page.getControl("new_datadoenvioassinatura").setDisabled(true);
        Xrm.Page.getControl("new_enviadoparaassinatura").setDisabled(true);
        if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
            PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
        }
    }

    if (Xrm.Page.getAttribute("new_tipodedistrato").getValue() == 1) { //Módulo
        Xrm.Page.getControl("new_linhadocontratoid").setVisible(true);
        Xrm.Page.getAttribute("new_linhadocontratoid").setRequiredLevel("required");
    } else {//Contrato
        Xrm.Page.getControl("new_linhadocontratoid").setVisible(false);
        Xrm.Page.getAttribute("new_linhadocontratoid").setRequiredLevel("none");
    }
}

function OnChange_new_solicitacaodedistratolog() { }

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
}

function OnChange_new_vistoriafeita() {
    if (Xrm.Page.getAttribute("new_vistoriafeita").getValue() == true) {
        Xrm.Page.getAttribute("new_datadavistoria").setRequiredLevel("required");
    } else {
        Xrm.Page.getAttribute("new_datadavistoria").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_datadavistoria").setValue(null);
    }
}

function OnChange_new_responsavelpelareforma() {
    if (Xrm.Page.getAttribute("new_responsavelpelareforma").getValue() == 2) {
        Xrm.Page.getAttribute("new_prazodareforma").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_formadepagamentodareforma").setRequiredLevel("required");
    } else {
        Xrm.Page.getAttribute("new_prazodareforma").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_formadepagamentodareforma").setRequiredLevel("none");
    }
}

function OnChange_new_isentodemultas() {
    if (Xrm.Page.getAttribute("new_isentodemultas").getValue() == false) {
        Xrm.Page.getAttribute("new_formadepagamentodemultas").setRequiredLevel("required");
        Xrm.Page.getAttribute("new_valordamulta").setRequiredLevel("required");
    } else {
        Xrm.Page.getAttribute("new_formadepagamentodemultas").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_valordamulta").setRequiredLevel("none");
        Xrm.Page.getAttribute("new_formadepagamentodemultas").setValue(null);
        Xrm.Page.getAttribute("new_valordamulta").setValue(null);
    }
}

function OnChange_new_linhadocontratoid() {
    if (Xrm.Page.getAttribute("new_contratoid").getValue() == null) {
        alert("Primeiro deve ser informado o Contrato.");
        Xrm.Page.getAttribute("new_moduloid").setValue(null);
        Xrm.Page.getAttribute("new_linhadocontratoid").setValue(null);
    } else {
        if (Xrm.Page.getAttribute("new_linhadocontratoid").getValue() !== null) {
            var entityUserRetrive = getEntityNodes('contractdetail', 'contractdetailid', Xrm.Page.getAttribute("new_linhadocontratoid").getValue()[0].id);
            var entityNodeUserRetrive = entityUserRetrive[0];
            var organizationId = entityNodeUserRetrive.selectSingleNode("q1:productid");
            organizationId = organizationId.text;
            var entityRetrive = getEntityNodes('product', 'productid', organizationId);
            var entityNodeRetrive = entityRetrive[0];
            var organizationName = entityNodeRetrive.selectSingleNode("q1:name");
            organizationName = organizationName.text;
            var lookupData = new Array();
            var lookupItem = new Object();
            lookupItem.id = organizationId;
            lookupItem.typename = 'product';
            lookupItem.name = organizationName;
            lookupData[0] = lookupItem;
            Xrm.Page.getAttribute("new_moduloid").setValue(lookupData);
        } else {
            Xrm.Page.getAttribute("new_moduloid").setValue(null);
        }
    }
}

function OnChange_new_contratoid() {
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('contract', 'contractid', Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        var entityNodeUserRetrive = entityUserRetrive[0];
        var empreendimentoId = entityNodeUserRetrive.selectSingleNode("q1:new_empreendimentoid");
        empreendimentoId = empreendimentoId.text;
        var entityRetriveE = getEntityNodes('new_empreendimento', 'new_empreendimentoid', empreendimentoId);
        var entityNodeRetriveE = entityRetriveE[0];
        var nomeEmpreendimento = entityNodeRetriveE.selectSingleNode("q1:new_name");
        nomeEmpreendimento = nomeEmpreendimento.text;
        var lookupDataE = new Array();
        var lookupItemE = new Object();
        lookupItemE.id = empreendimentoId;
        lookupItemE.typename = 'new_empreendimento';
        lookupItemE.name = nomeEmpreendimento;
        lookupDataE[0] = lookupItemE;
        Xrm.Page.getAttribute("new_empreendimentoid").setValue(lookupDataE);
        var clienteid = entityNodeUserRetrive.selectSingleNode("q1:customerid");
        clienteid = clienteid.text;
        var entityRetriveC = getEntityNodes('account', 'accountid', clienteid);
        var entityNodeRetriveC = entityRetriveC[0];
        var nomeCliente = entityNodeRetriveC.selectSingleNode("q1:name");
        nomeCliente = nomeCliente.text;
        var lookupDataC = new Array();
        var lookupItemC = new Object();
        lookupItemC.id = clienteid;
        lookupItemC.typename = 'account';
        lookupItemC.name = nomeCliente;
        lookupDataC[0] = lookupItemC;
        Xrm.Page.getAttribute("new_clienteid").setValue(lookupDataC);
        Xrm.Page.getControl("new_linhadocontratoid").setDisabled(false);
        FiltraLinhaContrato();
    } else {
        Xrm.Page.getAttribute("new_empreendimentoid").setValue(null);
        Xrm.Page.getAttribute("new_clienteid").setValue(null);
        Xrm.Page.getAttribute("new_linhadocontratoid").setValue(null);
        Xrm.Page.getAttribute("new_moduloid").setValue(null);
        Xrm.Page.getControl("new_linhadocontratoid").setDisabled(true);
    }
}

function FiltraLinhaContrato() {
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {

        var viewId = "{65EC9B45-EE81-4F89-BAF6-E7603FF8E1E8}";
        var entityName = "contractdetail";
        var contratoId = Xrm.Page.getAttribute("new_contratoid").getValue()[0].id;
        var viewDisplayName = "Linhas Assinadas ";
        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
        "<entity name='contractdetail'>" +

        "<filter type='and'>" +
        "<condition attribute='new_contratoid' operator='eq' value='" + contratoId + "' />" +
        " <condition attribute='new_statusdalinha' operator='eq' value= '2' /> " +
        "</filter>" +
        "</entity>" +
        "</fetch>";
        //Construir o layout da grid de pesquisa (Exibição)
        var layoutXml = "<grid name='resultset' " + "object='1' " + "jump='new_linhadocontratoid' " + "select='1' " + "icon='1' " + "preview='0'>" +
        "<row name='result' " + "id = 'contractdetailid'>" +
         "<cell name='productid' " + "width='150' />" +
         "<cell name='uomid' " + "width='50' />" +
         "<cell name='initialquantity' " + "width='100' />" +
         "<cell name='new_valornominal' " + "width='100' />" +
         "<cell name='net' " + "width='100' />" +
         "<cell name='discount' " + "width='100' />" +
         "<cell name='price' " + "width='100' />" +
         "<cell name='new_statusdalinha' " + "width='100' />" +
        "disableSorting='1' />" +
        "</row>" +
        "</grid>";
        //Adicionar a nova visão
        Xrm.Page.getControl("new_linhadocontratoid").addCustomView(viewId, entityName, viewDisplayName, fetchXml, layoutXml, true);
    } else {
        Xrm.Page.getControl("new_linhadocontratoid").setDisabled(true);
    }
}

function OnChange_new_tipodedistrato() {
    if (Xrm.Page.getAttribute("new_tipodedistrato").getValue() == 1) { //Módulo
        Xrm.Page.getControl("new_linhadocontratoid").setVisible(true);
        Xrm.Page.getAttribute("new_linhadocontratoid").setRequiredLevel("required");

    } else {//Contrato
        Xrm.Page.getAttribute("new_moduloid").setValue(null);
        Xrm.Page.getControl("new_linhadocontratoid").setVisible(false);
        Xrm.Page.getAttribute("new_linhadocontratoid").setRequiredLevel("none");
    }
}

/******************************************************/
/*                                                    */
/*                 Botões da Distrato                 */
/*                                                    */
/* Ref:$webresource:new_distrato_main_library         */
/*                                                    */
/******************************************************/

function DistratiDeferido() {
    if ((Xrm.Page.getAttribute("new_statusdasolicitacaodedistratos").getValue() == 6) && (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getAttribute('new_statusdasolicitacaodedistratos').setValue(3);
        if (Xrm.Page.getAttribute("new_tipodedistrato").getValue() == 1) {
            var entityRetrive = getEntityNodes('contractdetail', 'contractdetailid', Xrm.Page.getAttribute("new_linhadocontratoid").getValue()[0].id);
            var entityNodeRetrive = entityRetrive[0];
            var precoLinha = entityNodeRetrive.selectSingleNode("q1:price");
            precoLinha = precoLinha.text;
            setEntityNode("contractdetail", "contractdetailid", Xrm.Page.getAttribute("new_linhadocontratoid").getValue()[0].id, "discount", (precoLinha * 1), 0);
            setEntityNode("contractdetail", "contractdetailid", Xrm.Page.getAttribute("new_linhadocontratoid").getValue()[0].id, "new_statusdalinha", 5, 0);
            setEntityNode("product", "productid", Xrm.Page.getAttribute("new_moduloid").getValue()[0].id, "statuscode", 1, 0);
            setEntityNode("product", "productid", Xrm.Page.getAttribute("new_moduloid").getValue()[0].id, "new_status", 1, 0);
            var entityRetriveContrato = getEntityNodesDouble('contractdetail', 'new_contratoid', Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "new_statusdalinha", 2);
            if (entityRetriveContrato.length == 0) {
                setEntityNode("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "new_statusdocontrato", 5, 0);
            }
            alert("Distrato deferido. O Módulo estará disponível para locação em instantes.");
            Xrm.Page.getAttribute("new_solicitacaodedistratolog").setValue(1);
            Xrm.Page.getAttribute("new_datadasolicitacao").setValue(new Date());
            Xrm.Page.data.entity.save("save");
        } else {
            var entityRetriveCon = getEntityNodesDouble('contractdetail', 'new_contratoid', Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "new_statusdalinha", 2);
            if (entityRetriveCon.length !== 0) {
                //Distrato da Linha
                for (x = 0; x < entityRetriveCon.length; x++) {
                    var entityNodeRetriveCont = entityRetriveCon[x];
                    var idLinha = entityNodeRetriveCont.selectSingleNode("q1:contractdetailid");
                    var idProduto = entityNodeRetriveCont.selectSingleNode("q1:productid");
                    if (idLinha !== null && idProduto !== null) {
                        idLinha = idLinha.text;
                        idProduto = idProduto.text;
                        setEntityNode("contractdetail", "contractdetailid", idLinha, "new_statusdalinha", 5, 0);
                        setEntityNode("product", "productid", idProduto, "statuscode", 1, 0);
                        setEntityNode("product", "productid", idProduto, "new_status", 1, 0);
                    }
                }
                //Distrata o Contrato
                setEntityNode("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "new_statusdocontrato", 5, 0);
                alert("Distrato deferido. Os Módulos do Contrato estaram disponíveis para locação em instantes.");
                Xrm.Page.getAttribute("new_solicitacaodedistratolog").setValue(1);
                Xrm.Page.getAttribute("new_datadasolicitacao").setValue(new Date());
                Xrm.Page.data.entity.save("save");
            }
        }
    } else {
        alert("Somente distratos com Status Em Assinatura podem ser Deferidos.");
    }
}

function DistratoIndeferido() {
    if ((Xrm.Page.getAttribute("new_statusdasolicitacaodedistratos").getValue() == 6) && (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getAttribute('new_statusdasolicitacaodedistratos').setValue(4);
        Xrm.Page.data.entity.save("saveandclose");
        alert("Distrato Indeferido");
    } else {
        alert("Somente distratos com Status Em Assinatura podem ser indeferidos.");
    }
}

function DistratoCancelado() {
    if (((Xrm.Page.getAttribute("new_statusdasolicitacaodedistratos").getValue() == 1) || (Xrm.Page.getAttribute("new_statusdasolicitacaodedistratos").getValue() == 6)) && (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getAttribute('new_statusdasolicitacaodedistratos').setValue(5);
        Xrm.Page.data.entity.save("saveandclose");
        alert("Distrato Cancelado");
    } else {
        alert("Somente Distratos com Status Pendente ou Em Assinatura podem ser Cancelados.");
    }
}