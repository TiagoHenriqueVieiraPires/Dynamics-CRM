/*****************************************************************/
/*          Códigos Java Scritp's Entidade Item do Contrato      */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 29/06/2014                                    */
/*          Versão: 3.0                                          */
/*****************************************************************/

//Busca o Status do Contrato
function BuscaStatusContrato() {
    var StatusContrato = 1;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusContrato = entityNodeRetrive.selectSingleNode("q1:new_statusdocontrato");
            if (StatusContrato != null) { StatusContrato = StatusContrato.text; } else { StatusContrato = 1; }
        }
    }
    return StatusContrato;
}

//Busca a Metragem do Módulo para a Quantidade do Produto e os preços
function BuscaQuantidadeProduto() {
    var quantidade = 0;
    var precoUnitario = 0;
    var precoAcima2Modulos = 0;
    var precoGalpão = 0;
    if (Xrm.Page.getAttribute("productid").getValue() !== null) {
        var entityRetrive = getEntityNodes('product', 'productid', Xrm.Page.getAttribute("productid").getValue()[0].id);
        if (entityRetrive.length !== 0) {
            var entityNodeRetrive = entityRetrive[0];
            quantidade = entityNodeRetrive.selectSingleNode("q1:new_abl");
            if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
            precoUnitario = entityNodeRetrive.selectSingleNode("q1:price");
            if (precoUnitario !== null) { precoUnitario = precoUnitario.text; } else { precoUnitario = 0; }
            precoAcima2Modulos = entityNodeRetrive.selectSingleNode("q1:standardcost");
            if (precoAcima2Modulos !== null) { precoAcima2Modulos = precoAcima2Modulos.text; } else { precoAcima2Modulos = 0; }
            precoGalpão = entityNodeRetrive.selectSingleNode("q1:currentcost");
            if (precoGalpão !== null) { precoGalpão = precoGalpão.text; } else { precoGalpão = 0; }
        }
    }
    Xrm.Page.getAttribute("new_quantidade").setValue(quantidade * 1);
    // Xrm.Page.getAttribute("totalallotments").setValue(quantidade * 1);
}

function TotalDespesasGerais() {
    var codominio = 0;
    if (Xrm.Page.getAttribute("new_condominio").getValue() !== null) { codominio = Xrm.Page.getAttribute("new_condominio").getValue(); }
    var energiaAgua = 0;
    if (Xrm.Page.getAttribute("new_energiaagua").getValue() !== null) { energiaAgua = Xrm.Page.getAttribute("new_energiaagua").getValue(); }
    var iptu = 0;
    if (Xrm.Page.getAttribute("new_iptu").getValue() !== null) { iptu = Xrm.Page.getAttribute("new_iptu").getValue(); }
    var acrescimos = 0;
    if (Xrm.Page.getAttribute("new_acrescimos").getValue() !== null) { acrescimos = Xrm.Page.getAttribute("new_acrescimos").getValue(); }
    Xrm.Page.getAttribute("new_totaldedespesas").setValue((codominio * 1) + (energiaAgua * 1) + (iptu * 1));
    var total = (codominio * 1) + (energiaAgua * 1) + (iptu * 1) + (acrescimos * 1);
    Xrm.Page.getAttribute("new_total").setValue((total * 1));
    OnChange_new_avalornominal();
}

function FiltraProdutoDaProposta() {
    if ((Xrm.Page.getAttribute("new_contratoid").getValue() != null) && (Xrm.Page.getAttribute("productid").getValue() !== null)) {
        var idProduto = Xrm.Page.getAttribute("productid").getValue()[0].id;
        var status = "N";
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            propostaId = entityNodeRetrive.selectSingleNode("q1:new_propostaid");
            if (propostaId != null) {
                propostaId = propostaId.text;
                var entityRetriveI = getEntityNodes("quotedetail", "new_quoteid", propostaId);
                if (entityRetriveI.length != 0) {
                    var filtro = "";
                    for (x = 0; x < entityRetriveI.length; x++) {
                        var entityNodeRetriveI = entityRetriveI[x];
                        var id = entityNodeRetriveI.selectSingleNode("q1:productid");
                        id = id.text;
                        if (idProduto == id) {
                            status = "S";
                            var quntidade = entityNodeRetriveI.selectSingleNode("q1:quantity");
                            if (quntidade !== null) {
                                quntidade = quntidade.text;
                                Xrm.Page.getAttribute("new_quantidade").setValue((quntidade * 1));
                            }
                            var precoNegociado = entityNodeRetriveI.selectSingleNode("q1:priceperunit");
                            if (precoNegociado !== null) {
                                precoNegociado = precoNegociado.text;
                                Xrm.Page.getAttribute("new_valornominal").setValue((precoNegociado * 1));
                            } else { Xrm.Page.getAttribute("new_valornominal").setValue(null); }
                        }
                    }
                }
            }
        }
        if (status == "N") {
            alert("Este produto não faz parte da Proposta inserida nesse Contrato. Escolha outro Produto.");
            Xrm.Page.getAttribute("productid").setValue(null);
        }
    }
}

function OnLoad_contractdetail() {
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Somente em Contratos Rascunho Novos Itens podem ser inseridos");
        Xrm.Page.ui.close();
    }
    // Xrm.Page.getAttribute("totalallotments").setRequiredLevel("none");

    if ((BuscaStatusContrato() == "2") || (Xrm.Page.getAttribute("new_statusdalinha").getValue() == 2)
        || (BuscaStatusContrato() == "3") || (Xrm.Page.getAttribute("new_statusdalinha").getValue() == 3)
        || (BuscaStatusContrato() == "4") || (Xrm.Page.getAttribute("new_statusdalinha").getValue() == 4)
        || (BuscaStatusContrato() == "5") || (Xrm.Page.getAttribute("new_statusdalinha").getValue() == 5)) {
        DisabledAllRecording();
    }
}

function OnSave_contractdetail() {
    Xrm.Page.getControl("new_totaldedespesas").setDisabled(false);
    Xrm.Page.getControl("new_quantidade").setDisabled(false);
    // Xrm.Page.getControl("totalallotments").setDisabled(false);
    Xrm.Page.getControl("price").setDisabled(false);
    Xrm.Page.getControl("discount").setDisabled(false);
    Xrm.Page.getControl("new_total").setDisabled(false);
    Xrm.Page.getControl("new_salvar").setDisabled(false);
    Xrm.Page.getControl("new_valor").setDisabled(false);
    forceSave("new_salvar");
    TotalDespesasGerais();
    OnChange_new_avalornominal();
}

function OnChange_productid() {
    FiltraProdutoDaProposta();
    if (Xrm.Page.getAttribute("productid").getValue() != null) {
        var entityRetrive = getEntityNodesTree('contractdetail', 'productid', Xrm.Page.getAttribute("productid").getValue()[0].id, "new_statusdalinha", 1, "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            alert("Este produto ja foi inserido Contrato. Escolha outro Produto.");
            Xrm.Page.getAttribute("productid").setValue(null);
        }
    }
    if (Xrm.Page.getAttribute("productid").getValue() != null) {
        var entityRetrive = getEntityNodes('product', 'productid', Xrm.Page.getAttribute("productid").getValue()[0].id);
        var entityNodeRetrive = entityRetrive[0];
        var defaultuomidProduct = entityNodeRetrive.selectSingleNode("q1:defaultuomid");
        defaultuomidProduct = defaultuomidProduct.text;
        var entityRetriveUom = getEntityNodes('uom', 'uomid', defaultuomidProduct);
        var entityNodeUomRetrive = entityRetriveUom[0];
        var defaultUomidName = entityNodeUomRetrive.selectSingleNode("q1:name");
        defaultUomidName = defaultUomidName.text;
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = defaultuomidProduct;
        lookupItem.typename = 'uom';
        lookupItem.name = defaultUomidName;
        lookupData[0] = lookupItem;
        Xrm.Page.getAttribute("uomid").setValue(lookupData);
    } else {
        Xrm.Page.getAttribute("uomid").setValue(null);
    }
    BuscaQuantidadeProduto();
    OnChange_new_avalornominal();
}

function OnChange_new_condominio() {
    TotalDespesasGerais();
}

function OnChange_new_energiaagua() {
    TotalDespesasGerais();
}

function OnChange_new_iptu() {
    TotalDespesasGerais();
}

function OnChange_new_acrescimos() {
    TotalDespesasGerais();
}

function OnChange_new_quantidade() {
    OnChange_new_avalornominal();
}

function OnChange_new_avalornominal() {
    if ((Xrm.Page.getAttribute("new_valornominal").getValue() !== null) && (Xrm.Page.getAttribute("new_quantidade").getValue() !== null)) {

        Xrm.Page.getAttribute("new_valor").setValue(Xrm.Page.getAttribute("new_valornominal").getValue() * Xrm.Page.getAttribute("new_quantidade").getValue());
        var valor = Xrm.Page.getAttribute("new_valor").getValue();
        if (valor == null) { valor = 0; }

        var total = Xrm.Page.getAttribute("new_total").getValue();
        if (total == null) { total = 0; }
        Xrm.Page.getAttribute("price").setValue((valor * 1) + (total * 1));
    }
}

/******************************************************/
/*                                                    */
/*                 Botões da Linha                    */
/*                                                    */
/* Ref:$webresource:new_contractdetail_main_library   */
/*                                                    */
/******************************************************/
function CancelarItemLinha() {
    if ((Xrm.Page.getAttribute("new_statusdalinha").getValue() == 1) && (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getAttribute("new_statusdalinha").setValue(4);
        Xrm.Page.getAttribute("new_quantidade").setValue(0);
        Xrm.Page.data.entity.save("saveandclose");
    } else {
        alert("Somente Item Rascunho pode ser Cancelado.");
    }
}