/****************************************************************/
/*          Códigos Java Scritp's Entidade Empreendimento       */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 15/09/2014                                   */
/*          Versão: 6.0                                         */
/****************************************************************/

//Busca o total das ABL dos módulos deste empreendimento
function SomaAblTotalGalpao() {
    if (Xrm.Page.ui.getFormType() == 2) {
        var ablTotal = 0.00;
        var entityRetrive = getEntityNodesDouble('new_galprepavqua', 'new_empreendimentoid', Xrm.Page.data.entity.getId(), "statecode", "Active");
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var ablGalpao = entityNodeRetrive.selectSingleNode("q1:new_abl");
                if (ablGalpao !== null) { ablGalpao = ablGalpao.text; } else { ablGalpao = 0.0; }
                ablTotal += parseFloat(ablGalpao);
            }
        }
        Xrm.Page.getAttribute("new_areaabltotal").setValue(parseFloat(ablTotal));
    }
}

//Start para Comercialização
function StartComercializacao() {
    if (Xrm.Page.ui.getFormType() == 2) {
        if ((Xrm.Page.getAttribute("new_name").getValue() != null) &&
            (Xrm.Page.getAttribute("new_nomedoterreno").getValue() != null) &&
            ((Xrm.Page.getAttribute("new_condominiologistico").getValue() != null && Xrm.Page.getAttribute("new_condominiologistico").getValue() != false) ||
            (Xrm.Page.getAttribute("new_loteamentoindustrial").getValue() != null && Xrm.Page.getAttribute("new_loteamentoindustrial").getValue() != false) ||
            (Xrm.Page.getAttribute("new_office").getValue() != null && Xrm.Page.getAttribute("new_office").getValue() != false) ||
            (Xrm.Page.getAttribute("new_stripmall").getValue() != null && Xrm.Page.getAttribute("new_stripmall").getValue() != false) ||
            (Xrm.Page.getAttribute("new_shopping").getValue() != null && Xrm.Page.getAttribute("new_shopping").getValue() != false)) &&
            (Xrm.Page.getAttribute("new_areadoterreno").getValue() != null) &&
            (Xrm.Page.getAttribute("new_areaconstruida").getValue() != null) &&
            (Xrm.Page.getAttribute("new_areaabltotal").getValue() != null) &&
            (Xrm.Page.getAttribute("new_logradouro").getValue() != null) &&
            (Xrm.Page.getAttribute("new_cidadeid").getValue() != null) &&
            (Xrm.Page.getAttribute("new_estadoid").getValue() != null) &&
            (Xrm.Page.getAttribute("new_paisid").getValue() != null)) {
            if (Xrm.Page.getAttribute("new_startcomercializacao").getValue() !== true) {
                Xrm.Page.getControl("new_startcomercializacao").setDisabled(false);
                Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(false);
            } else {
                Xrm.Page.getControl("new_startcomercializacao").setDisabled(true);
                Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(true);
            }
        } else {
            Xrm.Page.getControl("new_startcomercializacao").setDisabled(true);
            Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(true);
        }
    } else {
        Xrm.Page.getControl("new_startcomercializacao").setDisabled(true);
        Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(true);
    }
}

function PercentualMrvLogParceiros() {
    if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodes('new_parceiro', 'new_empreendimentoid', Xrm.Page.data.entity.getId());
        var participacaoTotal = 0.00;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var percentualParceiro = entityNodeRetrive.selectSingleNode("q1:new_percentual");
                percentualParceiro = parseFloat(percentualParceiro.text);
                participacaoTotal += parseFloat(percentualParceiro);
            }
        }
        if ((Xrm.Page.getAttribute("new_mrvlogpercentual").getValue() + parseFloat(participacaoTotal)) > 100.00) {
            alert("O % de Participação Total não pode ultrapassar os 100%");
            event.returnValue = false;
        } else if ((Xrm.Page.getAttribute("new_mrvlogpercentual").getValue() + parseFloat(participacaoTotal)) < 100.00) {
            alert("A Participação Total deve ser de 100%");
        }
    }
}

function OnSave_new_empreendimento(prmContext) {
    //Abortado
    if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 3) {
        if (confirm("Esse Empreendimento Será Desativado. E TODOS OS DADOS SERÃO PERDIDOS. Deseja destivar o Empreendimento?")) {
        } else {
            return null;
        }
    }
    SomaAblTotalGalpao();
    PercentualMrvLogParceiros();
    Xrm.Page.getControl("new_areaabltotal").setDisabled(false);
    Xrm.Page.getControl("new_startcomercializacao").setDisabled(false);
    Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(false);
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
    Xrm.Page.getControl("new_datavencimentoopcaodecompraterreno").setDisabled(false);
    forceSave("new_salvar");
    CriaItemNaListaDePrecos("1");
    EnabledAllRecording();
}

function OnLoad_new_empreendimento() {
    PercentualMrvLogParceiros();
    StartComercializacao();
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(true);
    if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 1) {//Comprado
        Xrm.Page.getControl("new_datavencimentoopcaodecompraterreno").setDisabled(true);
        Xrm.Page.getControl("new_datadaaquisicaoterreno").setDisabled(false);
        Xrm.Page.getControl("new_aquisicaodoterreno").setDisabled(false);
        Xrm.Page.getControl("new_valordoterreno").setDisabled(false);
    } else if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 2) {//Opcionado
        Xrm.Page.getControl("new_datavencimentoopcaodecompraterreno").setDisabled(false);
        Xrm.Page.getControl("new_datadaaquisicaoterreno").setDisabled(true);
        Xrm.Page.getControl("new_aquisicaodoterreno").setDisabled(true);
        Xrm.Page.getControl("new_valordoterreno").setDisabled(true);
    } else if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 3) {
        Xrm.Page.getControl("new_statusdoterreno").setDisabled(true);
    }
    StatusEndereco();
}

function OnChange_new_cnpjspe() {
    maskValidCnpj("new_cnpjspe");
}

function OnChange_new_cnpjcondominio() {
    maskValidCnpj("new_cnpjcondominio");
}

function OnChange_new_mrvlogpercentual() {
    PercentualMrvLogParceiros();
}

function OnChange_new_cep() {
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

function OnChange_new_startcomercializacao() {
    if (Xrm.Page.getAttribute("new_startcomercializacao").getValue() == true) {
        Xrm.Page.getAttribute("new_datastartcomercializacao").setValue(new Date());
        Xrm.Page.getControl("new_datastartcomercializacao").setDisabled(false);
        CriaItemNaListaDePrecos("0");
        Xrm.Page.data.entity.save("saveandclose");
    }
}

function CriaItemNaListaDePrecos(mensagem) {
    if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodes("product", "new_empreendimentoid", Xrm.Page.data.entity.getId());
        var y = 0;
        var v = 0;
        var entityRetrivePriceLevel = getEntityNodes('pricelevel', 'statecode', "Active");
        if ((entityRetrivePriceLevel.length != 0) && (entityRetrive.length != 0)) {
            var entityNodeRetrivePriceLevel = entityRetrivePriceLevel[0];
            var pricelevelId1 = entityNodeRetrivePriceLevel.selectSingleNode("q1:pricelevelid");
            pricelevelId1 = pricelevelId1.text;
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var pricelevelId = entityNodeRetrive.selectSingleNode("q1:pricelevelid");
                var productId = entityNodeRetrive.selectSingleNode("q1:productid");
                productId = productId.text;
                var transactioncurrencyId = entityNodeRetrive.selectSingleNode("q1:transactioncurrencyid");
                transactioncurrencyId = transactioncurrencyId.text;
                var uomId = entityNodeRetrive.selectSingleNode("q1:defaultuomid");
                uomId = uomId.text;
                if ((mensagem == "1") && (pricelevelId == null) && (v == 0)) {
                    if (!confirm("Exitem Produtos que não estão Disponíveis pra Precificação. Deseja Deixa-los disponível para serem Precificados?")) {
                        return null;
                    }
                }
                v = 1;
                if (pricelevelId == null) {
                    var xml = "<?xml version='1.0' encoding='utf-8'?>" +
                    "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
                    " xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
                    " xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
                    GenerateAuthenticationHeader() +
                    "<soap:Body>" +
                    "<Create xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
                    "<entity xsi:type='productpricelevel'>" +
                       "<productid>" + productId + "</productid>" +
                       "<pricelevelid>" + pricelevelId1 + "</pricelevelid>" +
                       "<transactioncurrencyid>" + transactioncurrencyId + "</transactioncurrencyid>" +
                       "<uomid>" + uomId + "</uomid>" +
                       "<quantitysellingcode>1</quantitysellingcode>" +
                       "<pricingmethodcode>2</pricingmethodcode>" +
                       "<percentage>100</percentage>" +
                       "<roundingpolicycode>1</roundingpolicycode>" +
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
                }
            }
        }
    }
}

function OnChange_new_datadoalvaraobra() {
    if (Xrm.Page.getAttribute("new_datadoalvaraobra").getValue() !== null) {
        Xrm.Page.getAttribute("new_datadeprevisao").setValue(null);
    }
}

function OnChange_new_datadeprevisao() {
    if (Xrm.Page.getAttribute("new_datadeprevisao").getValue() !== null) {
        Xrm.Page.getAttribute("new_datadoalvaraobra").setValue(null);
    }
}

function OnChange_new_statusdoterreno() {
    if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 1) {//Comprado
        Xrm.Page.getAttribute("new_datavencimentoopcaodecompraterreno").setValue(null);
        Xrm.Page.getControl("new_datavencimentoopcaodecompraterreno").setDisabled(true);
        Xrm.Page.getControl("new_datadaaquisicaoterreno").setDisabled(false);
        Xrm.Page.getControl("new_aquisicaodoterreno").setDisabled(false);
        Xrm.Page.getControl("new_valordoterreno").setDisabled(false);
    } else if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 2) {//Opcionado
        Xrm.Page.getControl("new_datavencimentoopcaodecompraterreno").setDisabled(false);
        Xrm.Page.getAttribute("new_datadaaquisicaoterreno").setValue(null);
        Xrm.Page.getControl("new_datadaaquisicaoterreno").setDisabled(true);
        Xrm.Page.getAttribute("new_aquisicaodoterreno").setValue(null);
        Xrm.Page.getControl("new_aquisicaodoterreno").setDisabled(true);
        Xrm.Page.getAttribute("new_valordoterreno").setValue(null);
        Xrm.Page.getControl("new_valordoterreno").setDisabled(true);
    } else if (Xrm.Page.getAttribute("new_statusdoterreno").getValue() == 3) {//Abortado

    }
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