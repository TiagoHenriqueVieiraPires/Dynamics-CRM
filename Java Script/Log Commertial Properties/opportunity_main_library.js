/******************************************************************/
/*          Códigos Java Scritp's Entidade Oportunidade          */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 18/08/2014                                    */
/*          Versão: 5.0                                          */
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

function BuscaDadosCotacoesAtivasOuGanhas() {
    var actualValue = 0;
    var abl = 0;
    var acutalValueWon = 0;
    var acutalValueActive = 0;

    var entityRetrive = getEntityNodes('quote', 'opportunityid', Xrm.Page.data.entity.getId());
    if (entityRetrive.length !== 0) {
        for (x = 0; x < entityRetrive.length; x++) {
            var entityNodeRetrive = entityRetrive[x];
            var statecode = entityNodeRetrive.selectSingleNode("q1:statecode");
            statecode = statecode.text;
            var statucode = entityNodeRetrive.selectSingleNode("q1:statuscode");
            statucode = statucode.text;
            var quoteValue = entityNodeRetrive.selectSingleNode("q1:totalamout");
            if (quoteValue !== null) { quoteValue = quoteValue.text; } else { quoteValue = 0; }
            var quoteAbl = entityNodeRetrive.selectSingleNode("q1:new_abl");
            if (quoteAbl !== null) { quoteAbl = quoteAbl.text; } else { quoteAbl = 0; }
            if (((statecode == "Closed") && (statucode == 100000000)) || ((statecode == "Won") && (statucode == 4))) {//Ganhas
                acutalValueWon += quoteValue * 1;
                abl += quoteAbl * 1;
            }
            if ((statecode == "Active") && (statucode == 2)) {//Ativas
                acutalValueActive += quoteValue * 1;
                abl += quoteAbl * 1;
            }
        }
    }
    actualValue = (acutalValueWon * 1) + (acutalValueActive * 1);
    Xrm.Page.getAttribute("actualvalue").setValue(actualValue * 1);
    Xrm.Page.getAttribute("new_abl").setValue(abl * 1);
}

function OnSave_opportunity(prmContext) {
    if (prmContext != null && prmContext.getEventArgs() != null) {
        var wod_SaveMode = prmContext.getEventArgs().getSaveMode();
        /* if ((Xrm.Page.getAttribute("customerid").getValue() !== null) && (wod_SaveMode == 5)) {
             var entityUserRetrive = getEntityNodes('account', 'accountid', Xrm.Page.getAttribute("customerid").getValue()[0].id);
             if (entityUserRetrive.length !== 0) {
                 var entityNodeUserRetrive = entityUserRetrive[0];
                 var tipoDeRelacao = entityNodeUserRetrive.selectSingleNode("q1:customertypecode");
                 if (tipoDeRelacao !== null) { tipoDeRelacao = tipoDeRelacao.text; } else { tipoDeRelacao = 1; }
                 if (tipoDeRelacao == 2) {
                     var primarycontactid = entityNodeUserRetrive.selectSingleNode("q1:primarycontactid");
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
                         alert("Após a conclusão da Oportunidade, favor completar o cadastro do Cliente.");
                         prmContext.getEventArgs().preventDefault();
                     }
                 }
             }
         }*/
    }
    forceSave("new_salvar");
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
    if ((Xrm.Page.getAttribute("name").getValue() == null) &&
        (Xrm.Page.getAttribute("customerid").getValue() !== null) &&
        (Xrm.Page.getAttribute("new_empreendimentoid").getValue() !== null)) {
        Xrm.Page.getAttribute("name").setValue("Oportunidade: " + Xrm.Page.getAttribute("customerid").getValue()[0].name + " - " + Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].name);
    }
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
    Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
    Xrm.Page.getControl("new_abl").setDisabled(false);
    Xrm.Page.getControl("new_contratofechado").setDisabled(false);
    Xrm.Page.getControl("new_cotacaoganha").setDisabled(false);
    Xrm.Page.getControl("actualvalue").setDisabled(false);
    Xrm.Page.getControl("transactioncurrencyid").setDisabled(false);
    Xrm.Page.getControl("pricelevelid").setDisabled(false);
    BuscaDadosCotacoesAtivasOuGanhas();
}

function OnLoad_opportunity() {
    if (Xrm.Page.ui.getFormType() == 1) {
        PreencheUnidadeDeNegocio(GetCurrentUserId());
    } else if (Xrm.Page.ui.getFormType() == 2) {
        BuscaDadosCotacoesAtivasOuGanhas();
        if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() !== null) {
            Xrm.Page.getControl("new_empreendimentoid").setDisabled(true);
        }
        if (Xrm.Page.getAttribute("pricelevelid").getValue() !== null) {
            Xrm.Page.getControl("pricelevelid").setDisabled(true);
        }
        if (Xrm.Page.getAttribute("transactioncurrencyid").getValue() !== null) {
            Xrm.Page.getControl("transactioncurrencyid").setDisabled(true);
        }
    }
    if (Xrm.Page.getAttribute("parentcontactid").getValue() == null) {
        OnChange_customerid();
    }
    Xrm.Page.getControl("new_contratofechado").setDisabled(true);
    Xrm.Page.getControl("new_cotacaoganha").setDisabled(true);
    if (((Xrm.Page.ui.getFormType() == 2) || (Xrm.Page.ui.getFormType() == 1)) && (Xrm.Page.getAttribute("pricelevelid").getValue() == null)) { SetDefaultPriceList("pricelevelid"); }
    if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
        Xrm.Page.getControl("new_motivoid").setVisible(false);
    } else {
        Xrm.Page.getControl("new_motivoid").setVisible(true);
    }
}

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
}

function OnChange_customerid() {
    if (Xrm.Page.getAttribute("customerid").getValue() !== null) {
        var entityUserRetrive = getEntityNodes('account', 'accountid', Xrm.Page.getAttribute("customerid").getValue()[0].id);
        if (entityUserRetrive.length !== 0) {
            var entityNodeUserRetrive = entityUserRetrive[0];
            var contatoPrincipal = entityNodeUserRetrive.selectSingleNode("q1:primarycontactid");
            if (contatoPrincipal !== null) {
                contatoPrincipal = contatoPrincipal.text;
                var entityRetrive = getEntityNodes('contact', 'contactid', contatoPrincipal);
                var entityNodeRetrive = entityRetrive[0];
                var fullName = entityNodeRetrive.selectSingleNode("q1:fullname");
                fullName = fullName.text;
                var lookupData = new Array();
                var lookupItem = new Object();
                lookupItem.id = contatoPrincipal;
                lookupItem.typename = 'contact';
                lookupItem.name = fullName;
                lookupData[0] = lookupItem;
                Xrm.Page.getAttribute("parentcontactid").setValue(lookupData);
            }
        }
    }
}

function VerificaPropostaAberta() {
    var entityRetrive = getEntityNodesDouble('quote', 'opportunityid', Xrm.Page.data.entity.getId(), "statecode", "Draft");
    return entityRetrive.length;
}

function VerificaPropostaGanha() {
    var entityRetrive = getEntityNodesDouble('quote', 'opportunityid', Xrm.Page.data.entity.getId(), "statecode", "Won");
    return entityRetrive.length;
}

/******************************************************/
/*                                                    */
/*                 Botões do Proposta                 */
/*                                                    */
/* Ref:$webresource:new_oppotunity_main_library       */
/*                                                    */
/******************************************************/

//statusdaoportunidade

function GanharOportunidade() {
    if (VerificaPropostaGanha() > 0) {
        if (VerificaPropostaAberta() > 0) {
            alert("Existem " + VerificaPropostaAberta() + " Proposta(s) Aberta(s). Feche as Propostas Abertas antes de Ganhar a Oportunidade.");
            return null;
        } else {
            Xrm.Page.getAttribute("new_statusdaoportunidade").setValue(2);
            Xrm.Page.data.entity.save("saveandclose");
        }
    } else {
        alert('A Oportunidade não pode ser Fechada pois não possui Proposta Fechada.');
        return null;
    }
}

function PerderOportunidade() {
    if (VerificaPropostaAberta() > 0) {
        alert("Existem " + VerificaPropostaAberta() + " Proposta(s) Aberta(s). Feche as Propostas Abertas antes de Perder a Oportunidade.");
        return null;
    } else {
        if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
            alert("Preencha o Motivo da Perda.");
            Xrm.Page.getControl("new_motivoid").setVisible(true);
            Xrm.Page.getControl("new_motivoid").setFocus(true);
            return null;
        } else {
            Xrm.Page.getAttribute("new_statusdaoportunidade").setValue(4);
            Xrm.Page.data.entity.save("saveandclose");
        }
    }
}

function CancelarOportunidade() {
    if (VerificaPropostaAberta() > 0) {
        alert("Existem " + VerificaPropostaAberta() + " Proposta(s) Aberta(s). Feche as Propostas Abertas antes de Cancelar a Oportunidade.");
        return null;
    } else {
        if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
            alert("Preencha o Motivo do Cancelamento.");
            Xrm.Page.getControl("new_motivoid").setVisible(true);
            Xrm.Page.getControl("new_motivoid").setFocus(true);
            return null;
        } else {
            Xrm.Page.getAttribute("new_statusdaoportunidade").setValue(3);
            Xrm.Page.data.entity.save("saveandclose");
        }
    }
}