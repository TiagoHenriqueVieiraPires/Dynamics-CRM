/******************************************************************/
/*          Códigos Java Scritp's Entidade Produto da Cotação    */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data :28/08/2014                                    */
/*          Versão: 5.0                                          */
/*****************************************************************/

function VeficaDuplicidade() {
    var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.getAttribute("new_quoteid").getValue()[0].id);
    if ((entityRetrive.length !== 0) && (Xrm.Page.getAttribute("new_produtoid").getValue() !== null)) {
        for (x = 0; x < entityRetrive.length; x++) {
            var entityNodeRetrive = entityRetrive[x];
            var produtoid = entityNodeRetrive.selectSingleNode("q1:new_produtoid");
            produtoid = produtoid.text;
            if (Xrm.Page.getAttribute("new_produtoid").getValue()[0].id == produtoid) {
                alert("Produto ja Inserido na Proposta. Escolha outro");
                Xrm.Page.getAttribute("new_produtoid").setValue(null);
                Xrm.Page.getAttribute("productid").setValue(null);
                x = entityRetrive.length;
            }
        }
    }
}

function BuscaDadosCotacoesAtivasOuGanhas() {
    var actualValue = 0;
    var abl = 0;
    var acutalValueWon = 0;
    var acutalValueActive = 0;
    if (Xrm.Page.getAttribute("new_quoteid").getValue() !== null) {
        var entityRetriveQuote = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.getAttribute("new_quoteid").getValue()[0].id);
        if (entityRetriveQuote.length !== 0) {
            var entityRetriveNodeQuote = entityRetriveQuote[0];
            var opportunityId = entityRetriveNodeQuote.selectSingleNode("q1:opportunityid");
            if (opportunityId !== null) {
                opportunityId = opportunityId.text;
                var entityRetrive = getEntityNodes('quote', 'opportunityid', opportunityId);
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
                setEntityNode("opportunity", "opportunityid", opportunityId, "actualvalue", (actualValue * 1), 0);
                setEntityNode("opportunity", "opportunityid", opportunityId, "new_abl", (abl * 1), 0);
            }
        }
    }
}

//Valor médio locado por m² e ABL total
function BuscaAblTotalItems() {
    var quantidadeTotal = 0;
    var valorTotal = 0;
    var guId = "";
    var quoteId = Xrm.Page.getAttribute("new_quoteid").getValue()[0].id;
    if (Xrm.Page.ui.getFormType() == 2) { guId = Xrm.Page.data.entity.getId(); }
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        var entityRetrive = getEntityNodes('quotedetail', 'quoteid', Xrm.Page.getAttribute("new_quoteid").getValue()[0].id);
        if (entityRetrive.length !== 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var quantidade = entityNodeRetrive.selectSingleNode("q1:quantity");
                var quotedetailid = entityNodeRetrive.selectSingleNode("q1:quotedetailid");
                quotedetailid = quotedetailid.text;
                if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
                quantidadeTotal += quantidade * 1;
                var valor = entityNodeRetrive.selectSingleNode("q1:extendedamount");
                if (valor !== null) { valor = valor.text; } else { valor = 0; }
                if (guId == quotedetailid) {
                    valor = Xrm.Page.getAttribute("quantity").getValue();
                }
                valorTotal += valor * 1;
            }
        }
    }
    setEntityNode("quote", "quoteid", quoteId, "new_abl", (quantidadeTotal * 1), 0);
    /* if ((quantidadeTotal !== 0) && (valorTotal !== 0)) {
         var total = (valorTotal * 1) / (quantidadeTotal * 1);
         setEntityNode("quote", "quoteid", quoteId, "new_valormedio", (total * 1), 0);
     } else {
         setEntityNode("quote", "quoteid", quoteId, "new_valormedio", 0, 0);
     }*/
}

//Busca a Metragem do Módulo para a Quantidade do Produto e os preços
function BuscaQuantidadeProduto() {
    var quantidade = 0;
    var precoUnitario = 0;
    var precoAcima2Modulos = 0;
    var precoGalpao = 0;
    var galpaoId = "";
    if (Xrm.Page.getAttribute("productid").getValue() !== null) {
        var entityRetrive = getEntityNodes('product', 'productid', Xrm.Page.getAttribute("productid").getValue()[0].id);
        if (entityRetrive.length !== 0) {
            var entityNodeRetrive = entityRetrive[0];
            quantidade = entityNodeRetrive.selectSingleNode("q1:new_abl");
            if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
            galpaoId = entityNodeRetrive.selectSingleNode("q1:new_galprepavquaid");
            if (galpaoId !== null) {
                galpaoId = galpaoId.text;
                var entityRetriveQ = getEntityNodes("new_galprepavqua", "new_galprepavquaid", galpaoId);
                if (entityRetriveQ.length != 0) {
                    var entityNodeRetriveQ = entityRetriveQ[0];
                    var name = entityNodeRetriveQ.selectSingleNode("q1:new_name");
                    name = name.text;
                    var lookupData = new Array();
                    var lookupItem = new Object();
                    lookupItem.id = galpaoId;
                    lookupItem.typename = 'new_galprepavqua';
                    lookupItem.name = name;
                    lookupData[0] = lookupItem;
                    Xrm.Page.getAttribute("new_galpaoid").setValue(lookupData);
                } else {
                    Xrm.Page.getAttribute("new_galpaoid").setValue(null);
                }
            }
        }
    }
    Xrm.Page.getAttribute("quantity").setValue(quantidade * 1);
}

//Altera o Status do Produto Locável Em andamento (new_statusdalocacao)
function AlteraStatusProduto() {
    var statusProduto = VerificaStatusDoProduto();
    if (Xrm.Page.ui.getFormType() == 1) {
        if (statusProduto == 1) {//Disponível
            if (Xrm.Page.getAttribute("productid").getValue() !== null) {
                setEntityNode("product", "productid", Xrm.Page.getAttribute("productid").getValue()[0].id, "statuscode", 100000000, 0);
                setEntityNode("product", "productid", Xrm.Page.getAttribute("productid").getValue()[0].id, "new_status", 2, 0);
            }
        }

    } else if (Xrm.Page.ui.getFormType() == 2) {
        if (Xrm.Page.getAttribute("productid").getValue() !== null) {
            var entityRetrive = getEntityNodes('quotedetail', 'quotedetailid', Xrm.Page.data.entity.getId());
            if (entityRetrive.length !== 0) {
                var entityNodeRetrive = entityRetrive[0];
                productId = entityNodeRetrive.selectSingleNode("q1:productid");
                if (productId !== null) {
                    productId = productId.text;
                    if (productId !== Xrm.Page.data.entity.getId()) {
                        setEntityNode("product", "productid", productId, "statuscode", 1, 0);
                        setEntityNode("product", "productid", productId, "new_status", 1, 0);
                        setEntityNode("product", "productid", Xrm.Page.getAttribute("productid").getValue()[0].id, "statuscode", 100000000, 0);
                        setEntityNode("product", "productid", Xrm.Page.getAttribute("productid").getValue()[0].id, "new_status", 2, 0);
                    }
                }
            }
        }
    }
}

//Verificar se o produto pode ser locado.
function VerificaStatusDoProduto() {
    var statusProduto = 0;
    if (Xrm.Page.getAttribute("productid").getValue() !== null) {
        var entityRetrive = getEntityNodes('product', 'productid', Xrm.Page.getAttribute("productid").getValue()[0].id);
        if (entityRetrive.length !== 0) {
            var entityNodeRetrive = entityRetrive[0];
            statusProduto = entityNodeRetrive.selectSingleNode("q1:statuscode");
            if (statusProduto !== null) {
                statusProduto = statusProduto.text;
            }
        }
    }
    return statusProduto;
}

function OnSave_QuoteDetail(prmContext) {
    forceSave("new_salvar");
    Xrm.Page.getControl("quantity").setDisabled(false);
    Xrm.Page.getControl("new_valorunitariobase").setDisabled(false);
    Xrm.Page.getControl("new_valoracima2modulosbase").setDisabled(false);
    Xrm.Page.getControl("new_valorgalpaobase").setDisabled(false);
    Xrm.Page.getControl("priceperunit").setDisabled(false);
    Xrm.Page.getControl("new_galpaoid").setDisabled(false);
    if (Xrm.Page.ui.getFormType() == 1) {
        BuscaDadosCotacoesAtivasOuGanhas();
        BuscaAblTotalItems();
    }
    //AlteraStatusProduto();
}

function OnLoad_QuoteDetail() {
    Xrm.Page.getAttribute('productid').setRequiredLevel('none');
    if ((Xrm.Page.getAttribute("new_empreendimentoid").getValue() == null) && ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2))) {
        Xrm.Page.getControl("new_produtoid").setDisabled(true);
        Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
    }
    if (Xrm.Page.ui.getFormType() == 2) {
        Xrm.Page.getControl("new_produtoid").setDisabled(true);
        Xrm.Page.getControl("uomid").setDisabled(true);
    }
    Xrm.Page.getControl("priceperunit").setDisabled(true);
    Xrm.Page.getControl("new_galpaoid").setDisabled(true);
}

function OnChange_productid() {
    var statusProduto = VerificaStatusDoProduto();
    var statusProdutoName = "Não Especificado";
    if (statusProduto == 0) {
        statusProdutoName = "";
    } else if (statusProduto == 1) {
        statusProdutoName = "Disponível";
    } else if (statusProduto == 2) {
        statusProdutoName = "Cadastro Incorreto";
    } else if (statusProduto == 100000000) {
        statusProdutoName = "Em Negociação";
        // alert("O status do Produto escolhido se encontra como: " + statusProdutoName);
    } else if (statusProduto == 100000001) {
        statusProdutoName = "Locado";
        //alert("O status do Produto escolhido se encontra como: " + statusProdutoName);
    } else if (statusProduto == 100000002) {
        statusProdutoName = "Cancelado";
    } else if (statusProduto == 100000003) {
        statusProdutoName = "Desativado";
    } else {
        // alert("O status do Produto escolhido se encontra como: " + statusProdutoName);
    }
    BuscaQuantidadeProduto();
    retriveUomProduct("productid", "uomid");
    if ((Xrm.Page.getAttribute("productid").getValue() == null) && (Xrm.Page.getAttribute("new_produtoid").getValue() !== null)) { Xrm.Page.getAttribute("new_produtoid").setValue(null); }
}

function OnChange_new_produtoid() {
    VeficaDuplicidade();
    if (Xrm.Page.getAttribute("new_produtoid").getValue() !== null) {
        Xrm.Page.getAttribute("productid").setValue(Xrm.Page.getAttribute("new_produtoid").getValue());
    } else { Xrm.Page.getAttribute("productid").setValue(null); }
    OnChange_productid();
}

function OnChange_new_empreendimentoid() {
    if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() == null) {
        Xrm.Page.getControl("new_produtoid").setDisabled(true);
        Xrm.Page.getControl("new_empreendimentoid").setDisabled(false);
    }
    Xrm.Page.getControl("new_produtoid").setDisabled(false);
    Xrm.Page.getAttribute("new_produtoid").setValue(null);
}