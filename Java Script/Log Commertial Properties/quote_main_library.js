/******************************************************************/
/*          Códigos Java Scritp's Entidade Cotação               */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 29/08/2014                                    */
/*          Versão: 8.0                                          */
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
    if (Xrm.Page.getAttribute("opportunityid").getValue() !== null) {
        var entityRetrive = getEntityNodes('quote', 'opportunityid', Xrm.Page.getAttribute("opportunityid").getValue()[0].id);
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
        setEntityNode("opportunity", "opportunityid", Xrm.Page.getAttribute("opportunityid").getValue()[0].id, "actualvalue", (actualValue * 1), 0);
        setEntityNode("opportunity", "opportunityid", Xrm.Page.getAttribute("opportunityid").getValue()[0].id, "new_abl", (abl * 1), 0);
    }
}

//Valor médio locado por m² e ABL total
function BuscaAblTotalItems() {
    var quantidadeTotal = 0;
    var valorTotal = 0;
    if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
        if (entityRetrive.length !== 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var quantidade = entityNodeRetrive.selectSingleNode("q1:quantity");
                if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
                quantidadeTotal += quantidade * 1;
                var valor = entityNodeRetrive.selectSingleNode("q1:extendedamount");
                if (valor !== null) { valor = valor.text; } else { valor = 0; }
                valorTotal += valor * 1;
            }
        }
    }
    Xrm.Page.getAttribute("new_abl").setValue(quantidadeTotal * 1);
    /* if ((quantidadeTotal !== 0) && (valorTotal !== 0)) {
         var Total = (valorTotal * 1) / (quantidadeTotal * 1);
         Xrm.Page.getAttribute("new_valormedio").setValue(Total * 1);
     } else {
         Xrm.Page.getAttribute("new_valormedio").setValue(0);
     }*/
}

function ValidadePropostaComercial() {
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        if (Xrm.Page.getAttribute("effectivefrom").getValue() == null) {
            Xrm.Page.getAttribute("effectivefrom").setValue(new Date());
        }
        /*if (Xrm.Page.getAttribute("effectiveto").getValue() == null) {
            var primeiradata = new Date();
            primeiradata.setMonth(primeiradata.getMonth() + 1);
            Xrm.Page.getAttribute("effectiveto").setValue(new Date(primeiradata));
        }*/
    }
}

//Verifica se existem alterações no Projeto
function AlteracaoNoProjeto() {
    if (Xrm.Page.ui.getFormType() == 2) {
        if ((Xrm.Page.getAttribute("new_alteracaodeprojeto").getValue() == true) || (Xrm.Page.getAttribute("new_alteracaodeprojeto").getValue() == 1)) {
            Xrm.Page.getAttribute("new_area").setRequiredLevel("required");
            Xrm.Page.getAttribute("description").setRequiredLevel("required");
            Xrm.Page.getControl("new_area").setVisible(true);
            Xrm.Page.getControl("description").setVisible(true);
        } else {
            Xrm.Page.getAttribute("new_area").setRequiredLevel("none");
            Xrm.Page.getAttribute("description").setRequiredLevel("none");
            Xrm.Page.getControl("new_area").setVisible(false);
            Xrm.Page.getControl("description").setVisible(false);
        }
        if ((Xrm.Page.getAttribute("new_alteracaoaprovada").getValue() == 1) || (Xrm.Page.getAttribute("new_alteracaoaprovada").getValue() == 0)) {
            Xrm.Page.getAttribute("new_motivodostatusdaaprovacao").setRequiredLevel("required");
            Xrm.Page.getControl("new_motivodostatusdaaprovacao").setVisible(true);
        } else {
            Xrm.Page.getAttribute("new_motivodostatusdaaprovacao").setRequiredLevel("none");
            Xrm.Page.getControl("new_motivodostatusdaaprovacao").setVisible(false);
        }
    }
}

//Solicita o Valor da Garanta dependendo do Tipo
function TipoDeGarantia() {
    if (Xrm.Page.getAttribute("new_tipodegarantia").getValue() !== null) {
        var tipoGarantia = Xrm.Page.getAttribute("new_tipodegarantia").getValue();
        if (tipoGarantia == 1) {//Fiador Com imóvel
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("recommended");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        } else if (tipoGarantia == 2) {//Carta Fiança
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        } else if (tipoGarantia == 3) {//Seguro Fiança
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        } else if (tipoGarantia == 4) {//Caução
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("required");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        } else if (tipoGarantia == 5) {//Imóvel
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("recommended");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        } else if (tipoGarantia == 6) {
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(true);
        } else if (tipoGarantia == 7) {
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("required");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(true);
        } else {
            Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
            Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        }
    } else {
        Xrm.Page.getAttribute("new_valordagarantia").setRequiredLevel("none");
        Xrm.Page.ui.tabs.get("tab_garantia").sections.get("tab_garantia_section_observacao").setVisible(false);
        Xrm.Page.getAttribute("new_observacaogarantia").setRequiredLevel("none");
    }
}

function OnSave_Quote(prmContext) {
    var wod_SaveMode = prmContext.getEventArgs().getSaveMode();
    /* if (Xrm.Page.getAttribute("customerid").getValue() !== null) {
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
                     alert("Antes a conclusão da Proposta, favor completar o cadastro do Cliente.");
                     prmContext.getEventArgs().preventDefault();
                 }
             }
         }
     }*/
    if (Xrm.Page.ui.getFormType() !== 4) {
        forceSave("new_salvar");
        if (Xrm.Page.getAttribute("new_precificacao").getValue() !== true) {//Automatico
            BuscaPreco();
            CalculaPrecoAutomatico();
            Xrm.Page.getControl("effectiveto").setDisabled(false);
        }
        if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
            PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
        }
        Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
        Xrm.Page.getControl("new_abl").setDisabled(false);
        Xrm.Page.getControl("new_valormedio").setDisabled(false);
        BuscaAblTotalItems();
        BuscaDadosCotacoesAtivasOuGanhas();
        TipoDeGarantia();
        ValidadePropostaComercial();
        Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
        Xrm.Page.getControl("opportunityid").setDisabled(false);
        Xrm.Page.getControl("new_valorunitariobase").setDisabled(false);
        Xrm.Page.getControl("new_valoracima2modulosbase").setDisabled(false);
        Xrm.Page.getControl("new_valorgalpaobase").setDisabled(false);
    }
}

function OnLoad_Quote() {
    if (Xrm.Page.ui.getFormType() == 1) {
        PreencheUnidadeDeNegocio(GetCurrentUserId());
        TipoDeGarantia();
        AlteracaoNoProjeto();
        ValidadePropostaComercial();
        if (Xrm.Page.getAttribute("pricelevelid").getValue() !== null) {
            Xrm.Page.getControl("pricelevelid").setDisabled(true);
        }
    } else if (Xrm.Page.ui.getFormType() == 2) {
        BuscaAblTotalItems();
        BuscaDadosCotacoesAtivasOuGanhas();
        TipoDeGarantia();
        AlteracaoNoProjeto();
        ValidadePropostaComercial();
        if (Xrm.Page.getAttribute("pricelevelid").getValue() !== null) {
            Xrm.Page.getControl("pricelevelid").setDisabled(true);
        }
    }
    Xrm.Page.getControl("new_empreendimentoid").setDisabled(true);
    Xrm.Page.getControl("opportunityid").setDisabled(true);

    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        if (Xrm.Page.getAttribute("new_precificacao").getValue() == true) {//Manual
            Xrm.Page.getAttribute("new_valormedio").setRequiredLevel("required");
            Xrm.Page.getControl("new_valormedio").setDisabled(false);
        } else {//Automatica
            Xrm.Page.getAttribute("new_valormedio").setRequiredLevel("none");
            Xrm.Page.getControl("new_valormedio").setDisabled(true);
        }
    }

    if ((Xrm.Page.getAttribute("new_empreendimentoid").getValue() == null) && ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2))) {
        Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
    }
    if (((Xrm.Page.ui.getFormType() == 2) || (Xrm.Page.ui.getFormType() == 1)) && (Xrm.Page.getAttribute("pricelevelid").getValue() == null)) { SetDefaultPriceList("pricelevelid"); }
}

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
}

function OnChange_new_tipodegarantia() {
    TipoDeGarantia();
}

function OnChange_new_alteracaodeprojeto() {
    AlteracaoNoProjeto();
}

function OnChange_new_alteracaoaprovada() {
    AlteracaoNoProjeto();
}

function OnChange_new_precificacao() {
    if (Xrm.Page.getAttribute("new_precificacao").getValue() == true) {//Manual
        Xrm.Page.getAttribute("new_valormedio").setRequiredLevel("required");
        Xrm.Page.getControl("new_valormedio").setDisabled(false);
        Xrm.Page.getAttribute("new_valormedio").setValue(null);
    } else {//Automatica
        Xrm.Page.getAttribute("new_valormedio").setRequiredLevel("none");
        Xrm.Page.getControl("new_valormedio").setDisabled(true);
        BuscaPreco();
        CalculaPrecoAutomatico();
        Xrm.Page.data.entity.save("save");
    }
}

function BuscaPreco() {
    var precoUnitario = 0;
    var precoAcima2Modulos = 0;
    var precoGalpão = 0;
    if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() !== null) {
        var entityRetrive = getEntityNodes('product', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
        if (entityRetrive.length !== 0) {
            var entityNodeRetrive = entityRetrive[0];
            precoUnitario = entityNodeRetrive.selectSingleNode("q1:price");
            if (precoUnitario !== null) { precoUnitario = precoUnitario.text; } else { precoUnitario = 0; }
            precoAcima2Modulos = entityNodeRetrive.selectSingleNode("q1:standardcost");
            if (precoAcima2Modulos !== null) { precoAcima2Modulos = precoAcima2Modulos.text; } else { precoAcima2Modulos = 0; }
            precoGalpão = entityNodeRetrive.selectSingleNode("q1:currentcost");
            if (precoGalpão !== null) { precoGalpão = precoGalpão.text; } else { precoGalpão = 0; }
        }
    }
    Xrm.Page.getAttribute("new_valorunitariobase").setValue(precoUnitario * 1);
    Xrm.Page.getAttribute("new_valoracima2modulosbase").setValue(precoAcima2Modulos * 1);
    Xrm.Page.getAttribute("new_valorgalpaobase").setValue(precoGalpão * 1);
}

function VerificaProdutoInserido() {
    if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
        return entityRetrive.length;
    } else {
        return 0;
    }
}

function CalculaPrecoAutomatico() {
    var qtdGalpao = 0;
    var valorMedio = 0;
    var qtdModulos = 0;
    var qtdQuoteDetail = VerificaProdutoInserido();
    if (VerificaProdutoInserido() !== 0) { //Tem produto
        /*Produto da Cotação*/
        var quoteDetails = new Array();
        var entityRetriveQuoteDetail = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
        for (x = 0; x < entityRetriveQuoteDetail.length; x++) {
            var entityNodeRetriveQuoteDetail = entityRetriveQuoteDetail[x];
            var quoteDetailId = entityNodeRetriveQuoteDetail.selectSingleNode("q1:quotedetailid");
            var quoteDetailProductId = entityNodeRetriveQuoteDetail.selectSingleNode("q1:new_produtoid");
            var quoteDetailGalpaoId = entityNodeRetriveQuoteDetail.selectSingleNode("q1:new_galpaoid");
            if (quoteDetailGalpaoId !== null) { quoteDetailGalpaoId = quoteDetailGalpaoId; } else { quoteDetailGalpaoId = ""; }
            quoteDetails[x] = new MQuoteDetail(quoteDetailId.text, quoteDetailProductId.text, quoteDetailGalpaoId.text);

            DebbugerConsole(quoteDetails[x]);

        }
        /*Produto da Cotação*/
        /*Galpões*/
        var entityRetriveGalpoes = getEntityNodes('new_galprepavqua', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
        qtdGalpao = entityRetriveGalpoes.length;
        var galpoesDoEmpreendimento = new Array();//IdGalpao,QtdModulos,QtdLocados
        if (qtdGalpao !== 0) {
            for (x = 0; x < qtdGalpao; x++) {
                var entityNodeRetriveGalpoes = entityRetriveGalpoes[x];
                var galpaoId = entityNodeRetriveGalpoes.selectSingleNode("q1:new_galprepavquaid");
                qtdModulos = entityNodeRetriveGalpoes.selectSingleNode("q1:new_quantidade");
                if (qtdModulos !== null) { galpoesDoEmpreendimento[x] = new MGalpaoEmpreendimento(galpaoId.text, qtdModulos.text, 0); }
                else { galpoesDoEmpreendimento[x] = new MGalpaoEmpreendimento(galpaoId.text, 0, 0); }
                /*Módulos*/
                for (w = 0; w < qtdQuoteDetail; w++) {
                    if (galpoesDoEmpreendimento[x].galpaoId == quoteDetails[w].galpaoId) {
                        galpoesDoEmpreendimento[x].qtdLocados = parseInt(galpoesDoEmpreendimento[x].qtdLocados) + 1;
                    }
                }
                /*Módulos*/
            }
        }
        /*Verifica Valor*/
        for (z = 0; z < qtdGalpao; z++) {
            if (galpoesDoEmpreendimento[z].qtdModulos == galpoesDoEmpreendimento[z].qtdLocados) {
                z = qtdGalpao;
                valorMedio = Xrm.Page.getAttribute("new_valorgalpaobase").getValue();
            } else if (qtdQuoteDetail > 2) {
                valorMedio = Xrm.Page.getAttribute("new_valoracima2modulosbase").getValue();
            } else {
                valorMedio = Xrm.Page.getAttribute("new_valorunitariobase").getValue();
            }
        }

        /*Debug*/
        for (z = 0; z < qtdGalpao; z++) {
            DebbugerConsole(galpoesDoEmpreendimento[z]);
        }
        /*Debug*/

        /*Verifica Valor*/
        /*Atualiza Quote Detail*/
        for (x = 0; x < qtdQuoteDetail; x++) {
            setEntityNode("quotedetail", "quotedetailid", quoteDetails[x].quoteDetailId, "priceperunit", parseFloat(valorMedio), 0);
        }
        /*Atualiza Quote Detail*/
        /*Galpões*/
        if (valorMedio == 0) { Xrm.Page.getAttribute("new_valormedio").setValue(Xrm.Page.getAttribute("new_valorunitariobase").getValue()); }
        else { Xrm.Page.getAttribute("new_valormedio").setValue(parseFloat(valorMedio)); }
    } else {//Não tem produto 
        Xrm.Page.getAttribute("new_valormedio").setValue(Xrm.Page.getAttribute("new_valorunitariobase").getValue());
    }
}

function MQuoteDetail(quoteDetailId, productId, galpaoId) {
    this.quoteDetailId = quoteDetailId;
    this.productId = productId;
    this.galpaoId = galpaoId;
}

function MGalpaoEmpreendimento(galpaoId, qtdModulos, qtdLocados) {
    this.galpaoId = galpaoId;
    this.qtdModulos = qtdModulos;
    this.qtdLocados = qtdLocados;
}


/******************************************************/
/*                                                    */
/*                 Botões do Proposta                 */
/*                                                    */
/* Ref:$webresource:new_quote_main_library            */
/*                                                    */
/******************************************************/

function GanharProposta() {
    if ((Xrm.Page.ui.getFormType() == 2) && Xrm.Page.getAttribute("new_ganha").getValue() !== true) {
        if ((Xrm.Page.getAttribute("new_alteracaodeprojeto").getValue() == true) && (Xrm.Page.getAttribute("new_alteracaoaprovada").getValue() !== 1)) {//Projeto
            alert("Modificações não foram Aprovadas."); return false;
        }
        if ((Xrm.Page.getAttribute("new_tipodegarantia").getValue() == 6) && (Xrm.Page.getAttribute("new_garantiaaprovada").getValue() !== 1)) {//Garantia
            alert("Garantia não foi Aprovada."); return false;
        }
        var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
        if (entityRetrive.length !== 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var quotedetailId = entityNodeRetrive.selectSingleNode("q1:quotedetailid");
                quotedetailId = quotedetailId.text;
                setEntityNode('quotedetail', 'quotedetailid', quotedetailId, "new_quoteid", Xrm.Page.data.entity.getId(), 0);
                var productId = entityNodeRetrive.selectSingleNode("q1:productid");
                productId = productId.text;
                setEntityNode("product", "productid", productId, "statuscode", 100000000, 0);
                setEntityNode("product", "productid", productId, "new_status", 2, 0);
            }
            if (Xrm.Page.getAttribute("effectiveto").getValue() !== null) {
                Xrm.Page.getAttribute("new_ganha").setValue(true);
                Xrm.Page.data.entity.save("saveandclose");
                /*
                                if (Xrm.Page.getAttribute("new_criacontrato").getValue() == false || Xrm.Page.getAttribute("new_criacontrato").getValue() == null) {
                                    if (confirm('Deseja iniciar o cadastro do Espelho do Contrato?')) {
                                        CriaContratoLOG();
                                    } else {
                                        alert("A Proposta deverá ser criada Manualmente dentro do Módulo de Locação");
                                    }
                                }
                */

            } else {
                alert("Preencha a Data de Término da Proposta.");
                Xrm.Page.getAttribute("effectiveto").setRequiredLevel("required");
                Xrm.Page.getControl("effectiveto").setDisabled(false);
                Xrm.Page.getControl("effectiveto").setFocus(true);
                return false;
            }
        } else {
            alert("Proposta Comercial não Possui Itens.");
            return false;
        }
    }
}

function PerderCotacao() {
    if ((Xrm.Page.ui.getFormType() == 2) && Xrm.Page.getAttribute("new_perdida").getValue() !== true) {
        /* var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
         if (entityRetrive.length !== 0) {
             for (x = 0; x < entityRetrive.length; x++) {
                 var entityNodeRetrive = entityRetrive[x];
                 var productId = entityNodeRetrive.selectSingleNode("q1:productid");
                 productId = productId.text;
                 setEntityNode("product", "productid", productId, "statuscode", 1, 0);
                 setEntityNode("product", "productid", productId, "new_status", 1, 0);
             }
         }*/
        if (Xrm.Page.getAttribute("effectiveto").getValue() !== null) {
            Xrm.Page.getAttribute("new_carencia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_vigenciacontratual").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_tipodegarantia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_perdida").setValue(true);
            Xrm.Page.data.entity.save("saveandclose");
        } else {
            alert("Preencha a Data de Término da Proposta.");
            Xrm.Page.getAttribute("effectiveto").setRequiredLevel("required");
            Xrm.Page.getControl("effectiveto").setDisabled(false);
            Xrm.Page.getControl("effectiveto").setFocus(true);
            return null;
        }
    }
}

function CancelarCotacao() {
    if ((Xrm.Page.ui.getFormType() == 2) && Xrm.Page.getAttribute("new_cancelar").getValue() !== true) {
        /*  var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
          if (entityRetrive.length !== 0) {
              for (x = 0; x < entityRetrive.length; x++) {
                  var entityNodeRetrive = entityRetrive[x];
                  var productId = entityNodeRetrive.selectSingleNode("q1:productid");
                  productId = productId.text;
                  setEntityNode("product", "productid", productId, "statuscode", 1, 0);
                  setEntityNode("product", "productid", productId, "new_status", 1, 0);
              }
          }*/
        if (Xrm.Page.getAttribute("effectiveto").getValue() !== null) {
            Xrm.Page.getAttribute("new_carencia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_vigenciacontratual").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_tipodegarantia").setRequiredLevel("none");
            Xrm.Page.getAttribute("new_cancelar").setValue(true);
            Xrm.Page.data.entity.save("saveandclose");
        } else {
            alert("Preencha a Data de Término da Proposta.");
            Xrm.Page.getAttribute("effectiveto").setRequiredLevel("required");
            Xrm.Page.getControl("effectiveto").setDisabled(false);
            Xrm.Page.getControl("effectiveto").setFocus(true);
            return null;
        }
    }
}

function CriaContratoLOG() { }

function OnChange_new_valormedio() {
    if (Xrm.Page.getAttribute("new_valormedio").getValue() !== null) {
        var valorMedio = Xrm.Page.getAttribute("new_valormedio").getValue();
        var qtdQuoteDetail = VerificaProdutoInserido();
        if (VerificaProdutoInserido() !== 0) { //Tem produto
            /*Produto da Cotação*/
            var entityRetriveQuoteDetail = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.data.entity.getId());
            for (x = 0; x < entityRetriveQuoteDetail.length; x++) {
                var entityNodeRetriveQuoteDetail = entityRetriveQuoteDetail[x];
                var quoteDetailId = entityNodeRetriveQuoteDetail.selectSingleNode("q1:quotedetailid");
                quoteDetailId = quoteDetailId.text;
                setEntityNode("quotedetail", "quotedetailid", quoteDetailId, "priceperunit", parseFloat(valorMedio), 0);
            }
            Xrm.Page.data.entity.save("save");
        }
    }
}