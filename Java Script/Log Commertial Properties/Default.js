/****************************************************************/
/*          Códigos Java Scritp's Padrões para CRM 2011         */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 05/05/2014                                   */
/*          Versão: 7.0                                         */
/****************************************************************/

/*  Nome: releaseForRecording
    Objetivo: Libera os Campos do Formulário para Gravação
    Paramentros:
    Retorno:
    Exemplo:
        releaseForRecording()   */
function releaseForRecording() {
    //Libera todos os campos do Formulario que estão somente leitura
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        if (control.getDisabled()) {
            control.setDisabled(false);
        }
    }
}

/*  Nome: DisabledAllRecording
    Objetivo: Disabilita todos os resgistros
    Paramentros:
    Retorno:
    Exemplo:
        DisabledAllRecording()   */
function DisabledAllRecording() {
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        if (!control.getDisabled()) {
            control.setDisabled(true);
        }
    }
}

/*  Nome: updateColorField
    Objetivo: Altera a cor do Campo
    Paramentros: 
        filtd (Nome do Campo)
        color (Cor)
    Retorno:
    Exemplo:
        updateColorField('new_name', 'red')   */
function updateColorField(filel, color) {
    document.getElementById(filel).style.backgroundColor = color;
}

/*  Nome: EnabledAllRecording
    Objetivo: Habilita todos os resgistros
    Paramentros:
    Retorno:
    Exemplo:
        EnabledAllRecording()   */
function EnabledAllRecording() {
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        if (control.getDisabled()) {
            control.setDisabled(false);
        }
    }
}

/*   Busca Dados em Outra Entidade   */
function getEntityNodes(entidade, atributo, parametro) {
    var DataXml = "" +
  "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
   GenerateAuthenticationHeader() +
   " <soap:Body>" +
    " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
     " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
     " <q1:EntityName>" + entidade + "</q1:EntityName>" +
     " <q1:ColumnSet xsi:type=\"q1:AllColumns\" />" +
     " <q1:Distinct>false</q1:Distinct>" +
     " <q1:Criteria>" +
      " <q1:FilterOperator>And</q1:FilterOperator>" +
      " <q1:Conditions>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
      " </q1:Conditions>" +
     " </q1:Criteria>" +
     " </query>" +
    " </RetrieveMultiple>" +
   " </soap:Body>" +
  "</soap:Envelope>" + "";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", DataXml.length);
    xmlHttpRequest.send(DataXml);
    var Result = xmlHttpRequest.responseXML;
    var BusinessEntityNodes = Result.selectNodes("//RetrieveMultipleResult/BusinessEntities/BusinessEntity");
    return BusinessEntityNodes;
}

/*   Busca Dados em Outra Entidade com dois parametros   */
function getEntityNodesDouble(entidade, atributo1, parametro1, atributo2, parametro2) {
    var DataXml = "" +
  "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
   GenerateAuthenticationHeader() +
   " <soap:Body>" +
    " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
     " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
     " <q1:EntityName>" + entidade + "</q1:EntityName>" +
     " <q1:ColumnSet xsi:type=\"q1:AllColumns\" />" +
     " <q1:Distinct>false</q1:Distinct>" +
     " <q1:Criteria>" +
      " <q1:FilterOperator>And</q1:FilterOperator>" +
      " <q1:Conditions>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo1 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro1 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo2 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro2 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
      " </q1:Conditions>" +
     " </q1:Criteria>" +
     " </query>" +
    " </RetrieveMultiple>" +
   " </soap:Body>" +
  "</soap:Envelope>" + "";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", DataXml.length);
    xmlHttpRequest.send(DataXml);
    var Result = xmlHttpRequest.responseXML;
    var BusinessEntityNodes = Result.selectNodes("//RetrieveMultipleResult/BusinessEntities/BusinessEntity");
    return BusinessEntityNodes;
}

/*   Busca Dados em Outra Entidade com tres parametros   */
function getEntityNodesTree(entidade, atributo1, parametro1, atributo2, parametro2, atributo3, parametro3) {
    var DataXml = "" +
  "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
   GenerateAuthenticationHeader() +
   " <soap:Body>" +
    " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
     " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
     " <q1:EntityName>" + entidade + "</q1:EntityName>" +
     " <q1:ColumnSet xsi:type=\"q1:AllColumns\" />" +
     " <q1:Distinct>false</q1:Distinct>" +
     " <q1:Criteria>" +
      " <q1:FilterOperator>And</q1:FilterOperator>" +
      " <q1:Conditions>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo1 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro1 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo2 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro2 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo3 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro3 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
      " </q1:Conditions>" +
     " </q1:Criteria>" +
     " </query>" +
    " </RetrieveMultiple>" +
   " </soap:Body>" +
  "</soap:Envelope>" + "";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", DataXml.length);
    xmlHttpRequest.send(DataXml);
    var Result = xmlHttpRequest.responseXML;
    var BusinessEntityNodes = Result.selectNodes("//RetrieveMultipleResult/BusinessEntities/BusinessEntity");
    return BusinessEntityNodes;
}

/*   Busca Dados em Outra Entidade com tres parametros   */
function getEntityNodesFour(entidade, atributo1, parametro1, atributo2, parametro2, atributo3, parametro3, atributo4, parametro4) {
    var DataXml = "" +
  "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
   GenerateAuthenticationHeader() +
   " <soap:Body>" +
    " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
     " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
     " <q1:EntityName>" + entidade + "</q1:EntityName>" +
     " <q1:ColumnSet xsi:type=\"q1:AllColumns\" />" +
     " <q1:Distinct>false</q1:Distinct>" +
     " <q1:Criteria>" +
      " <q1:FilterOperator>And</q1:FilterOperator>" +
      " <q1:Conditions>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo1 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro1 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo2 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro2 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo3 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro3 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
       " <q1:Condition>" +
       " <q1:AttributeName>" + atributo4 + "</q1:AttributeName>" +
       " <q1:Operator>Equal</q1:Operator>" +
       " <q1:Values>" +
       " <q1:Value xsi:type=\"xsd:string\">" + parametro4 + "</q1:Value>" +
       " </q1:Values>" +
       " </q1:Condition>" +
      " </q1:Conditions>" +
     " </q1:Criteria>" +
     " </query>" +
    " </RetrieveMultiple>" +
   " </soap:Body>" +
  "</soap:Envelope>" + "";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", DataXml.length);
    xmlHttpRequest.send(DataXml);
    var Result = xmlHttpRequest.responseXML;
    var BusinessEntityNodes = Result.selectNodes("//RetrieveMultipleResult/BusinessEntities/BusinessEntity");
    return BusinessEntityNodes;
}

/*  Nome: releaseForRecording
    Objetivo: Retorna o nome Unidade de Negócio do Usuário Logado
    Paramentros:
    Retorno: String
    Exemplo:
        var NomeDaUnidade = GetMyBusinessUnit()   */
function GetMyBusinessUnit() {
    var xml = "" +
    "<?xml version='1.0' encoding='utf-8'?>" +
    "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
    " xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
    " xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
    GenerateAuthenticationHeader() +
    "<soap:Body>" +
    "<Fetch xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
    "<fetchXml>" +
    " &lt;fetch mapping='logical' count='1'&gt;" +
    " &lt;entity name='businessunit'&gt;" +
    " &lt;attribute name='name' /&gt;" +
    " &lt;filter&gt;" +
    " &lt;condition attribute='businessunitid' operator='eq-businessid' /&gt;" +
    " &lt;/filter&gt;" +
    " &lt;/entity&gt;" +
    " &lt;/fetch&gt;" +
    "</fetchXml>" +
    "</Fetch>" +
    "</soap:Body>" +
    "</soap:Envelope>";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Fetch");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", xml.length);
    xmlHttpRequest.send(xml);
    var resultXml = xmlHttpRequest.responseXML;
    var resultSet = resultXml.text;
    resultSet.replace('&lt;', '< ');
    resultSet.replace('&gt;', '>');
    var oXmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    oXmlDoc.async = false;
    oXmlDoc.loadXML(resultSet);
    var result = oXmlDoc.getElementsByTagName('name');
    var result2 = oXmlDoc.getElementsByTagName('id');
    return (result[0].text);
}

/*  Nome: GetMyBusinessUnitFull
    Objetivo: Retorna a Unidade de Negócio do Usuário Logado
    Paramentros: Tipo( 1 - Nome, 2 - Guid, 3 - Looockup)
    Retorno: String
    Exemplo:
        var NomeDaUnidade = GetMyBusinessUnit()   */
function GetMyBusinessUnitFull(tipo) {
    var xml = "" +
    "<?xml version='1.0' encoding='utf-8'?>" +
    "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
    " xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
    " xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
    GenerateAuthenticationHeader() +
    "<soap:Body>" +
    "<Fetch xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
    "<fetchXml>" +
    " &lt;fetch mapping='logical' count='1'&gt;" +
    " &lt;entity name='businessunit'&gt;" +
    " &lt;attribute name='name' /&gt;" +
    " &lt;filter&gt;" +
    " &lt;condition attribute='businessunitid' operator='eq-businessid' /&gt;" +
    " &lt;/filter&gt;" +
    " &lt;/entity&gt;" +
    " &lt;/fetch&gt;" +
    "</fetchXml>" +
    "</Fetch>" +
    "</soap:Body>" +
    "</soap:Envelope>";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Fetch");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", xml.length);
    xmlHttpRequest.send(xml);
    var resultXml = xmlHttpRequest.responseXML;
    var resultSet = resultXml.text;
    resultSet.replace('&lt;', '< ');
    resultSet.replace('&gt;', '>');
    var oXmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    oXmlDoc.async = false;
    oXmlDoc.loadXML(resultSet);
    var result = oXmlDoc.getElementsByTagName('name');
    var result2 = oXmlDoc.getElementsByTagName('id');
    if (tipo == 1) {
        return (result[0].text);
    } else if (tipo == 2) {
        return (result2[0].text);
    } else if (tipo == 3) {
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = result2[0].text;
        lookupItem.typename = 'businessunit';
        lookupItem.name = result[0].text;
        lookupData[0] = lookupItem;
        return (lookupData);
    } else {
        return null;
    }
}

/*   Atualiza Dados em Outra Entidade   */
function setEntityNode(entidade, atributo, atributoid, campoValor, valor, menssagem) {
    var xml = "<?xml version='1.0' encoding='utf-8'?>" +
"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
" xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
" xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
GenerateAuthenticationHeader() +
"<soap:Body>" +
"<Update xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
"<entity xsi:type='" + entidade + "'>" +
"<" + campoValor + ">" + valor + "</" + campoValor + ">" +
"<" + atributo + ">" + atributoid + "</" + atributo + ">" +
"</entity>" +
"</Update>" +
"</soap:Body>" +
"</soap:Envelope>";
    var xHReq = new ActiveXObject("Msxml2.XMLHTTP");
    xHReq.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xHReq.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Update");
    xHReq.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xHReq.setRequestHeader("Content-Length", xml.length);
    xHReq.send(xml);
    var resultXml = xHReq.responseXML;
    var errorCount = resultXml.selectNodes('//error').length;
    if (errorCount != 0) {
        var msg = resultXml.selectSingleNode('//description').nodeTypedValue;
        alert(msg);
    }
    else {
        if (menssagem == 1) {
            alert("Successfully updated.");
        }
    }
}

/*   Deletar Dados de Outra Entidade   */
function deleteEntityNode(entidade, atributoId) {
    var xml = "<?xml version='1.0' encoding='utf-8'?>" +
"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
" xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
" xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
GenerateAuthenticationHeader() +
"<soap:Body>" +
"<Delete xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
"<entityName>" + entidade + "</entityName>" +
"<id>" + atributoId + "</id>" +
"</Delete>" +
"</soap:Body>" +
"</soap:Envelope>";
    var xHReq = new ActiveXObject("Msxml2.XMLHTTP");
    xHReq.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xHReq.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/Delete");
    xHReq.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xHReq.setRequestHeader("Content-Length", xml.length);
    xHReq.send(xml);
    var resultXml = xHReq.responseXML;
    var errorCount = resultXml.selectNodes('//error').length;
    if (errorCount != 0) {
        var msg = resultXml.selectSingleNode('//description').nodeTypedValue;
        alert(msg);
    }
    else {
        alert("Successfully deleted");
    }
}

/*   Criar Dados em Outra Entidade   */
function createEntityNode(entidade, atributo, atributoValor) {
    var xml = "<?xml version='1.0' encoding='utf-8'?>" +
"<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'" +
" xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'" +
" xmlns:xsd='http://www.w3.org/2001/XMLSchema'>" +
GenerateAuthenticationHeader() +
"<soap:Body>" +
"<Create xmlns='http://schemas.microsoft.com/crm/2007/WebServices'>" +
"<entity xsi:type='" + entidade + "'>" +
    "<" + atributo + ">" + atributoValor + "</" + atributo + ">" +
    //"<address1_city>"+address1_city+"</address1_city>"+ 
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
    else {
        alert("Successfully created.");
    }
}

/* Busca todas a funções do usuário */
// Exemplo de Utilização if (currentUserHasRole('Aprovador') == true) {}
function GetCurrentUserRoles() {
    var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
 "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
 GenerateAuthenticationHeader() +
 " <soap:Body>" +
 " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
 " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
 " <q1:EntityName>role</q1:EntityName>" +
 " <q1:ColumnSet xsi:type=\"q1:ColumnSet\">" +
 " <q1:Attributes>" +
 " <q1:Attribute>name</q1:Attribute>" +
 " </q1:Attributes>" +
 " </q1:ColumnSet>" +
 " <q1:Distinct>false</q1:Distinct>" +
 " <q1:LinkEntities>" +
 " <q1:LinkEntity>" +
 " <q1:LinkFromAttributeName>roleid</q1:LinkFromAttributeName>" +
 " <q1:LinkFromEntityName>role</q1:LinkFromEntityName>" +
 " <q1:LinkToEntityName>systemuserroles</q1:LinkToEntityName>" +
 " <q1:LinkToAttributeName>roleid</q1:LinkToAttributeName>" +
 " <q1:JoinOperator>Inner</q1:JoinOperator>" +
 " <q1:LinkEntities>" +
 " <q1:LinkEntity>" +
 " <q1:LinkFromAttributeName>systemuserid</q1:LinkFromAttributeName>" +
 " <q1:LinkFromEntityName>systemuserroles</q1:LinkFromEntityName>" +
 " <q1:LinkToEntityName>systemuser</q1:LinkToEntityName>" +
 " <q1:LinkToAttributeName>systemuserid</q1:LinkToAttributeName>" +
 " <q1:JoinOperator>Inner</q1:JoinOperator>" +
 " <q1:LinkCriteria>" +
 " <q1:FilterOperator>And</q1:FilterOperator>" +
 " <q1:Conditions>" +
 " <q1:Condition>" +
 " <q1:AttributeName>systemuserid</q1:AttributeName>" +
 " <q1:Operator>EqualUserId</q1:Operator>" +
 " </q1:Condition>" +
 " </q1:Conditions>" +
 " </q1:LinkCriteria>" +
 " </q1:LinkEntity>" +
 " </q1:LinkEntities>" +
 " </q1:LinkEntity>" +
 " </q1:LinkEntities>" +
 " </query>" +
 " </RetrieveMultiple>" +
 " </soap:Body>" +
 "</soap:Envelope>";

    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", " http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", xml.length);
    xmlHttpRequest.send(xml);

    var resultXml = xmlHttpRequest.responseXML;
    return (resultXml);
}

/* Compara a função escolhida com as funções de usuário */
function currentUserHasRole(roleName) {
    var oXml = GetCurrentUserRoles();
    if (oXml != null) {
        var roles = oXml.selectNodes("//BusinessEntity/q1:name");
        if (roles != null) {
            for (i = 0; i < roles.length; i++) {
                if (roles[i].text == roleName) {
                    return true;
                }
            }
        }
    }
    return false;
}

/*   Preenche Endereço de acordo com o  Busca CEP  V1 */
function retrivePostalCodeV1(codigoPostal, campoCep, campoLogradouro, campoBairro, campoCidade, campoEstado, campoPais) {
    if (Xrm.Page.getAttribute(codigoPostal).getValue() != null) {
        var attributForm = Xrm.Page.getAttribute(codigoPostal).getValue()[0].name;
        var exp = /\-|\.|\/|\(|\)| /g;
        attributForm = attributForm.replace(exp, "");
        var entityRetrive = getEntityNodes("new_codigopostal", "new_name", attributForm);
        var cep = '';
        var logradouro = '';
        var bairro = '';
        var cidade = '';
        var estado = '';
        var pais = '';
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            cep = entityNodeRetrive.selectSingleNode("q1:new_name");
            if (cep != null) { cep = cep.text; } else { cep = ''; }
            logradouro = entityNodeRetrive.selectSingleNode("q1:new_logradouro");
            if (logradouro != null) { logradouro = logradouro.text; } else { logradouro = ''; }
            vbairro = entityNodeRetrive.selectSingleNode("q1:new_bairro");
            if (bairro != null) { bairro = bairro.text; } else { bairro = ''; }
            cidade = entityNodeRetrive.selectSingleNode("q1:new_cidade");
            if (cidade != null) { cidade = cidade.text; } else { cidade = ''; }
            estado = entityNodeRetrive.selectSingleNode("q1:new_estado");
            if (estado != null) { estado = estado.text; } else { estado = ''; }
            pais = entityNodeRetrive.selectSingleNode("q1:new_pais");
            if (pais != null) { pais = pais.text; } else { pais = ''; }
        }
        Xrm.Page.getAttribute(campoCep).setValue(maskValidCep(cep));
        Xrm.Page.getAttribute(campoLogradouro).setValue(logradouro);
        Xrm.Page.getAttribute(campoBairro).setValue(bairro);
        Xrm.Page.getAttribute(campoCidade).setValue(cidade);
        Xrm.Page.getAttribute(campoEstado).setValue(estado);
        Xrm.Page.getAttribute(campoPais).setValue(pais);
    }
}

/*   Preenche Endereço de acordo com o CEP  V2 */
//"address1_postalcode", "address1_name", "address1_line3", "address1_city", "address1_stateorprovince", "address1_country"
function retrivePostalCodeV2(codigoPostal, campoLogradouro, campoBairro, campoCidade, campoEstado, campoPais) {
    var attributForm = '';
    var logradouro = '';
    var bairro = '';
    var cidade = '';
    var estado = '';
    var pais = '';
    if (Xrm.Page.getAttribute(codigoPostal).getValue() != null) {
        attributForm = Xrm.Page.getAttribute(codigoPostal).getValue();
        var exp = /\-|\.|\/|\(|\)| /g;
        attributForm = attributForm.replace(exp, "");
        var entityRetrive = getEntityNodes("new_codigopostal", "new_name", attributForm);
        if (attributForm.length == 8) { attributForm = attributForm.substr(0, 5) + '-' + attributForm.substr(5, 3); } else { attributForm = ''; }
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            logradouro = entityNodeRetrive.selectSingleNode("q1:new_logradouro");
            if (logradouro != null) { logradouro = logradouro.text; } else { logradouro = ''; }
            vbairro = entityNodeRetrive.selectSingleNode("q1:new_bairro");
            if (bairro != null) { bairro = bairro.text; } else { bairro = ''; }
            cidade = entityNodeRetrive.selectSingleNode("q1:new_cidade");
            if (cidade != null) { cidade = cidade.text; } else { cidade = ''; }
            estado = entityNodeRetrive.selectSingleNode("q1:new_estado");
            if (estado != null) { estado = estado.text; } else { estado = ''; }
            pais = entityNodeRetrive.selectSingleNode("q1:new_pais");
            if (pais != null) { pais = pais.text; } else { pais = ''; }
        } else { alert('CEP não encontrado.'); }
    }
    Xrm.Page.getAttribute(codigoPostal).setValue(attributForm);
    Xrm.Page.getAttribute(campoLogradouro).setValue(logradouro);
    Xrm.Page.getAttribute(campoBairro).setValue(bairro);
    Xrm.Page.getAttribute(campoCidade).setValue(cidade);
    Xrm.Page.getAttribute(campoEstado).setValue(estado);
    Xrm.Page.getAttribute(campoPais).setValue(pais);
}

/*  Nome: retrivePostalCodeV3
    Objetivo: Preenche Endereço de acordo com o CEP  V3
    Paramentros:    
        codigoPostal (Nome do Campo)
        campoLogradouro (Nome do Campo)
        campoBairro (Nome do Campo)
        campoCidade (Nome do Campo)
        tipoCampoCidade (0 - Retorna Texto, 1 - Retorna Guid)
        campoEstado (Nome do Campo)
        tipoCampoEstado (0 - Retorna Texto, 1 - Retorna Guid, 2 - Retorna Número)
        campoPais (Nome do Campo)
        tipoCampoPais (0 - Retorna Texto, 1 - Retorna Guid)
        limpaCampos (0 - Não, 1 Sim)
    Exemplo:
        "address1_postalcode", "address1_name", "address1_line3", "address1_city", 0, "address1_stateorprovince", 0, "address1_country", 0, 1   */
function retrivePostalCodeV3(codigoPostal, campoLogradouro, campoBairro, campoCidade, tipoCampoCidade, campoEstado, tipoCampoEstado, campoPais, tipoCampoPais, limpaCampos) {
    var attributForm = '';
    var logradouro = '';
    var bairro = '';
    var cidade = '';
    var estado = '';
    var pais = '';
    if (Xrm.Page.getAttribute(codigoPostal).getValue() != null) {
        attributForm = Xrm.Page.getAttribute(codigoPostal).getValue();
        attributForm = attributForm.replace(/\-|\.|\/|\(|\)| /g, "");
        if (attributForm.length != 8) {
            alert('CEP Inválido!');
            Xrm.Page.getAttribute(codigoPostal).setValue(null);
            if (limpaCampos == 1) {
                Xrm.Page.getAttribute(campoLogradouro).setValue(null);
                Xrm.Page.getAttribute(campoBairro).setValue(null);
                Xrm.Page.getAttribute(campoCidade).setValue(null);
                Xrm.Page.getAttribute(campoEstado).setValue(null);
                Xrm.Page.getAttribute(campoPais).setValue(null);
                return null;
            } else { return null; }
        }
        Xrm.Page.getAttribute(codigoPostal).setValue(attributForm.substr(0, 5) + '-' + attributForm.substr(5, 3));
        var entityRetriveCP = getEntityNodes("new_codigopostal", "new_name", attributForm);
        if (entityRetriveCP.length != 0) {
            var entityNodeRetriveCP = entityRetriveCP[0];
            logradouro = entityNodeRetriveCP.selectSingleNode("q1:new_logradouro");
            if (logradouro != null) { logradouro = logradouro.text; Xrm.Page.getAttribute(campoLogradouro).setValue(logradouro); } else { Xrm.Page.getAttribute(campoLogradouro).setValue(null); }
            bairro = entityNodeRetriveCP.selectSingleNode("q1:new_bairro");
            if (bairro != null) { bairro = bairro.text; Xrm.Page.getAttribute(campoBairro).setValue(bairro); } else { Xrm.Page.getAttribute(campoBairro).setValue(null); }
            cidade = entityNodeRetriveCP.selectSingleNode("q1:new_cidadeid");
            if (cidade != null) {
                cidade = cidade.text;
                if (tipoCampoCidade == 0) { retrivedLoockupName("new_cidade", "new_cidadeid", cidade, "new_name", campoCidade); }
                else {
                    var entityRetrive = getEntityNodes("new_cidade", "new_cidadeid", cidade);
                    if (entityRetrive.length != 0) {
                        var entityNodeRetrive = entityRetrive[0];
                        var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                        name = name.text;
                        var lookupData = new Array();
                        var lookupItem = new Object();
                        lookupItem.id = cidade;
                        lookupItem.typename = "new_cidade";
                        lookupItem.name = name;
                        lookupData[0] = lookupItem;
                        Xrm.Page.getAttribute(campoCidade).setValue(lookupData);
                    }
                }
            }
            estado = entityNodeRetriveCP.selectSingleNode("q1:new_estadoid");
            if (estado != null) {
                estado = estado.text;
                if (tipoCampoEstado == 0) { retrivedLoockupName("new_estado", "new_estadoid", estado, "new_name", campoEstado); }
                else if (tipoCampoEstado == 1) {
                    var entityRetrive = getEntityNodes("new_estado", "new_estadoid", estado);
                    if (entityRetrive.length != 0) {
                        var entityNodeRetrive = entityRetrive[0];
                        var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                        name = name.text;
                        var lookupData = new Array();
                        var lookupItem = new Object();
                        lookupItem.id = pais;
                        lookupItem.typename = "new_estado";
                        lookupItem.name = name;
                        lookupData[0] = lookupItem;
                        Xrm.Page.getAttribute(campoEstado).setValue(lookupData);
                    }
                }
                else if (tipoCampoEstado == 2) { retrivedLoockupPicklist("new_estado", "new_estadoid", estado, "new_uf", campoEstado); }
            }
            pais = entityNodeRetriveCP.selectSingleNode("q1:new_paisid");
            if (pais != null) {
                pais = pais.text;
                if (tipoCampoPais == 0) { retrivedLoockupName("new_pais", "new_paisid", pais, "new_name", campoPais); }
                else {
                    var entityRetrive = getEntityNodes("new_pais", "new_paisid", pais);
                    if (entityRetrive.length != 0) {
                        var entityNodeRetrive = entityRetrive[0];
                        var name = entityNodeRetrive.selectSingleNode("q1:new_name");
                        name = name.text;
                        var lookupData = new Array();
                        var lookupItem = new Object();
                        lookupItem.id = pais;
                        lookupItem.typename = "new_pais";
                        lookupItem.name = name;
                        lookupData[0] = lookupItem;
                        Xrm.Page.getAttribute(campoPais).setValue(lookupData);
                    }
                }
            }
        } else if ((entityRetriveCP.length != 0) && (limpaCampos == 1)) {
            Xrm.Page.getAttribute(campoLogradouro).setValue(null);
            Xrm.Page.getAttribute(campoBairro).setValue(null);
            Xrm.Page.getAttribute(campoCidade).setValue(null);
            Xrm.Page.getAttribute(campoEstado).setValue(null);
            Xrm.Page.getAttribute(campoPais).setValue(null);
            return null;
        }
    } else if (limpaCampos == 1) {
        Xrm.Page.getAttribute(campoLogradouro).setValue(null);
        Xrm.Page.getAttribute(campoBairro).setValue(null);
        Xrm.Page.getAttribute(campoCidade).setValue(null);
        Xrm.Page.getAttribute(campoEstado).setValue(null);
        Xrm.Page.getAttribute(campoPais).setValue(null);
        return null;
    }
}

/*   Oculta Guia   */ //1, false  ou  1, true
function showHidTab(tab, showHid) {
    var tabs = Xrm.Page.ui.tabs.get();
    var tab = tabs[tab];
    tab.setVisible(showHid);
}

/*  Mascara de Telefone   */
function maskPhoneFull(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        attributFormNew = attributForm.replace(/[^0-9]/g, '');
        if (attributFormNew.length == 10) {
            attributFormNew = "(" + attributFormNew.substr(0, 2) + ") " + attributFormNew.substr(2, 4) + "-" + attributFormNew.substr(6, 4);
        } else if (attributFormNew.length == 11) {
            attributFormNew = "(" + attributFormNew.substr(0, 2) + ") " + attributFormNew.substr(2, 5) + "-" + attributFormNew.substr(7, 4);
        } else if (attributFormNew.length == 12) {
            attributFormNew = attributFormNew.substr(0, 2) + " (" + attributFormNew.substr(2, 2) + ") " + attributFormNew.substr(4, 4) + "-" + attributFormNew.substr(8, 4);
        } else if (attributFormNew.length > 10) {
            attributFormNew = "(" + attributFormNew.substr(0, 2) + ") " + attributFormNew.substr(2, 4) + "-" + attributFormNew.substr(6, 4) + "  Ramal " + attributFormNew.substr(10, 4);
        } else {
            attributFormNew = '';
            alert("Número de Telefone Incorreto! Ex: 3132362700 / 31332362700 / 553132362700");
        }
        Xrm.Page.getAttribute(attribut).setValue(attributFormNew);
        focusAttibute(attribut);
    }
}

/*  Mascara de Telefone   */
function maskPhone(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        attributFormNew = attributForm.replace(/[^0-9]/g, '');
        if (attributFormNew.length == 10) {
            attributFormNew = "(" + attributFormNew.substr(0, 2) + ") " + attributFormNew.substr(2, 4) + "-" + attributFormNew.substr(6, 4);
        } else if (attributFormNew.length == 11) {
            attributFormNew = "(" + attributFormNew.substr(0, 2) + ") " + attributFormNew.substr(2, 5) + "-" + attributFormNew.substr(7, 4);
        } else if (attributFormNew.length == 12) {
            attributFormNew = attributFormNew.substr(0, 2) + " (" + attributFormNew.substr(2, 2) + ") " + attributFormNew.substr(4, 4) + "-" + attributFormNew.substr(8, 4);
        } else {
            attributFormNew = '';
            alert("Número de Telefone Incorreto! Ex: 3132362700 / 31332362700 / 553132362700");
        }
        Xrm.Page.getAttribute(attribut).setValue(attributFormNew);
        focusAttibute(attribut);
    }
}

/*   Mascara e Valida CNPJ   */
function maskValidCnpj(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        var exp = /\-|\.|\/|\(|\)| /g;
        attributForm = attributForm.replace(exp, "");
        if ((attributForm.length == 14) && (attributForm != "00000000000000") && (attributForm != "11111111111111") && (attributForm != "22222222222222") && (attributForm != "33333333333333") && (attributForm != "44444444444444") && (attributForm != "55555555555555") && (attributForm != "66666666666666") && (attributForm != "77777777777777") && (attributForm != "88888888888888") && (attributForm != "99999999999999")) {
            var valida = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
            var dig1 = new Number;
            var dig2 = new Number;
            var digito = new Number(eval(attributForm.charAt(12) + attributForm.charAt(13)));
            for (i = 0; i < valida.length; i++) {
                dig1 += (i > 0 ? (attributForm.charAt(i - 1) * valida[i]) : 0);
                dig2 += attributForm.charAt(i) * valida[i];
            }
            dig1 = (((dig1 % 11) < 2) ? 0 : (11 - (dig1 % 11)));
            dig2 = (((dig2 % 11) < 2) ? 0 : (11 - (dig2 % 11)));
            if (((dig1 * 10) + dig2) != digito) {
                alert("Número de CNPJ inválido!");
                attributForm = '';
            } else {
                attributForm = attributForm.substr(0, 2) + '.' + attributForm.substr(2, 3) + '.' + attributForm.substr(5, 3) + '/' + attributForm.substr(8, 4) + '-' + attributForm.substr(12, 2);
            }
        } else {
            alert('Número de CNPJ inválido!');
            attributForm = '';
        }
        Xrm.Page.getAttribute(attribut).setValue(attributForm);
    }
}

/*   Mascara e Valida CPF   */
function maskValidCpf(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        var exp = /\-|\.|\/|\(|\)| /g
        attributForm = attributForm.replace(exp, "");
        if ((attributForm.length == 11) && (attributForm != "00000000000") && (attributForm != "11111111111") && (attributForm != "22222222222") && (attributForm != "33333333333") && (attributForm != "44444444444") && (attributForm != "55555555555") && (attributForm != "66666666666") && (attributForm != "77777777777") && (attributForm != "88888888888") && (attributForm != "99999999999")) {
            var a = [];
            var b = new Number;
            var c = 11;
            for (i = 0; i < 11; i++) {
                a[i] = attributForm.charAt(i);
                if (i < 9) b += (a[i] * --c);
            }
            if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
            b = 0;
            c = 11;
            for (y = 0; y < 10; y++) b += (a[y] * c--);
            if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }
            if ((attributForm.charAt(9) != a[9]) || (attributForm.charAt(10) != a[10])) {
                alert("Número de CPF inválido.");
                attributForm = "";
            } else {
                attributForm = attributForm.substr(0, 3) + '.' + attributForm.substr(3, 3) + '.' + attributForm.substr(6, 3) + '-' + attributForm.substr(9, 2);
            }
        } else {
            alert("Número de CPF inválido.");
            attributForm = "";
        }
        Xrm.Page.getAttribute(attribut).setValue(attributForm);
    }
}

/*   Mascara e Valida CPF - CNPJ   */
function maskValidCpfCnpj(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        var exp = /\-|\.|\/|\(|\)| /g
        attributForm = attributForm.replace(exp, "");
        if ((attributForm.length == 11) && (attributForm != "00000000000") && (attributForm != "11111111111") && (attributForm != "22222222222") && (attributForm != "33333333333") && (attributForm != "44444444444") && (attributForm != "55555555555") && (attributForm != "66666666666") && (attributForm != "77777777777") && (attributForm != "88888888888") && (attributForm != "99999999999")) {
            maskValidCpf(attribut);
        } else if ((attributForm.length == 14) && (attributForm != "00000000000000") && (attributForm != "11111111111111") && (attributForm != "22222222222222") && (attributForm != "33333333333333") && (attributForm != "44444444444444") && (attributForm != "55555555555555") && (attributForm != "66666666666666") && (attributForm != "77777777777777") && (attributForm != "88888888888888") && (attributForm != "99999999999999")) {
            maskValidCnpj(attribut)
        } else {
            alert("Número de CPF - CNPJ inválido.");
            attributForm = "";
            Xrm.Page.getAttribute(attribut).setValue(attributForm);
        }
    }
}

/*   Mascara e Valida CEP   */
function maskValidCep(attribut) {
    var attributForm = Xrm.Page.getAttribute(attribut).getValue();
    if (attributForm != null) {
        var exp = /\-|\.|\/|\(|\)| /g
        attributForm = attributForm.replace(exp, "");
        if (attributForm.length == 8) {
            attributForm = attributForm.substr(0, 2) + '.' + attributForm.substr(2, 3) + '-' + attributForm.substr(5, 3);
        } else {
            alert("Número de CEP inválido.");
            attributForm = "";
            focusAttibute(attribut);
        }
        Xrm.Page.getAttribute(attribut).setValue(attributForm);
    }
}

/*   Retirar Acentos   */
function removingAccents(attribut) {
    if (attribut != null) {
        var attributForm = attribut;
        var withAccent = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
        var noAccent = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
        var attributNew = '';
        for (i = 0; i < attributForm.length; i++) {
            if (withAccent.search(attributForm.substr(i, 1)) >= 0) {
                attributNew += noAccent.substr(withAccent.search(attributForm.substr(i, 1)), 1);
            }
            else { attributNew += attributForm.substr(i, 1); }
        }
        return attributNew;
    } else { return ''; }
}

/*   Retorna o Status do Formulário   */
function statusForm() {
    // 0 – Undefined     1 – Create     2 – Update     3 – Read Only     4 – Disabled     5 – Quick Create (Deprecated)     6 – Bulk Edit
    var status = Xrm.Page.ui.getFormType();
    return (status);
}

/*   Formata Data   */
function formatDate(attibute, tipo) {
    var oldData = Xrm.Page.getAttribute(attibute).getValue();
    var dia = oldData.getDate();
    var mes = oldData.getMonth() + 1;
    var nomeMes = '';
    if (mes == 1) { nomeMes = 'Janeiro'; }
    else if (mes == 2) { nomeMes = 'Fevereiro'; }
    else if (mes == 3) { nomeMes = 'Março'; }
    else if (mes == 4) { nomeMes = 'Abril'; }
    else if (mes == 5) { nomeMes = 'Maio'; }
    else if (mes == 6) { nomeMes = 'Junho'; }
    else if (mes == 7) { nomeMes = 'Julho'; }
    else if (mes == 8) { nomeMes = 'Agosto'; }
    else if (mes == 9) { nomeMes = 'Setembro'; }
    else if (mes == 10) { nomeMes = 'Outubro'; }
    else if (mes == 11) { nomeMes = 'Novembro'; }
    else { nomeMes = 'Dezembro'; }
    var ano = oldData.getYear();
    if (tipo == 1) {
        return (dia + ' de ' + nomeMes + ' de ' + ano);
    }
    else if (tipo == 2) {
        return (dia + '/' + mes + '/' + ano);
    }
}

/*   Mostrar um Relatório Publicano no CRM em um Iframe   */
/*seguir pra construção do Relatório link http://translate.google.com.br/translate?hl=pt-BR&sl=en&tl=pt&u=http%3A%2F%2Fblogs.msdn.com%2Fb%2Fceibner%2Farchive%2F2009%2F07%2F28%2Fbuilding-a-crm-4-0-report-that-will-be-accessed-via-an-iframe.aspx&anno=2 */
/*BrMarinas:  "APP-SVR-3/ReportServer","Imagem+Registro+V+1.1","Homologacao_MSCRM","IFRAME_photo"
"SQL-SVR-1/ReportServer","Imagem+Registro+V+1.1","Homologacao_MSCRM","IFRAME_photo"
*/
function SetReportPhoto(Servidor, RDLName, DataBaseCrm, AttributIframe) {
    var status = Xrm.Page.ui.getFormType();
    var pageElement = Xrm.Page.getControl(AttributIframe);
    if ((status != 1) && (status != 5)) {
        var IdRegistro = Xrm.Page.data.entity.getId();
    } else { var IdRegistro = "00000000-0000-0000-0000-000000000000"; }
    var urlAttribute = 'http://' + Servidor + '/Pages/ReportViewer.aspx?%2f' + DataBaseCrm + '%2f' + RDLName + '&rs:Command=Render&rc:Toolbar=false&rs:ClearSession=true&id=' + IdRegistro;
    pageElement.setSrc(urlAttribute);
}

/*   Setar Link em um Iframe   */
//"IFRAME_Inadimplente",("http://sql-svr-1/ReportServer/Pages/ReportViewer.aspx?%2fRelat%c3%b3rios+Externos%2fRelat%c3%b3rio+de+Inadimplentes&rs:Command=Render&rc:Toolbar=false&rs:ClearSession=true&id=" + Xrm.Page.getAttribute('accountnumber').getValue())
function setLinkIframe(iframe, value) {
    var pageElement = Xrm.Page.getControl(iframe);
    if ((value == null) || (statusForm() == 1) || (statusForm() == 5)) {
        pageElement.setSrc("about:blank");
    }
    else {
        pageElement.setSrc(value);
    }
}

/*   Atribuir Valores Automaticos  Em Branco*/
//Exemplo: "totalallotments",0   "firstname",Xrm.Page.getAttribute('companyname').getValue()   "new_dataehorasaidareal", "new_dataehorasaidaprevista"
function assignValorses(attribut, value) {
    if (Xrm.Page.getAttribute(attribut).getValue() == null) {
        Xrm.Page.getAttribute(attribut).setValue(value);
    }
}

/*   Atribuir Valores Automaticos   Preencidos */
//Exemplo: "totalallotments",0   "firstname",Xrm.Page.getAttribute('companyname').getValue()   "new_dataehorasaidareal", "new_dataehorasaidaprevista"
function assignValorsesFull(attribut, value) {
    Xrm.Page.getAttribute(attribut).setValue(value);
}

/*   Atribuir Valores Automaticos  */
//Exemplo: "totalallotments","totalallotments"   "new_diadecobranca", "new_diadevencimentodaparcela" "new_codigo","new_contador"
function copiaValores(attribut, value) {
    var a = Xrm.Page.getAttribute(value).getValue();
    Xrm.Page.getAttribute(attribut).setValue(a);
}

function copiaValoresString(attribut, value) {
    var a = Xrm.Page.getAttribute(value).getValue();
    Xrm.Page.getAttribute(attribut).setValue(a.toString());
}

function copiaValoreString(attribut, value) {
    var a = Xrm.Page.getAttribute(value).getValue();
    Xrm.Page.getAttribute(attribut).setValue(a.toString());
}

/*   Enumerador Sequencial de Registro de Entidade   */
//Criar campo para servir de referência de Consulta para Enumerar o registros (new_entityenumerada, bit, default = Sim (1))
//Criara campo para ser o contador (new_contador, inteiro, default = 0)
//Criar um campo para ser numerado e ser demostrado na tela (new_codigo, nvarchar, default = 0)
// Exemplo:      "new_crecenciamento","new_entityenumerada",1,"new_codigo","new_contador"
function autoEnumeradorEntity(entidade, atributo, parametro, codigoRegistro, contador) {
    if (Xrm.Page.getAttribute(contador).getValue() == 0) {
        var entityRetrive = getEntityNodes(entidade, atributo, parametro);
        var maior = 0;
        maior = maior * 1;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var campoNumerador = entityNodeRetrive.selectSingleNode("q1:" + contador);
                if (campoNumerador != null) {
                    campoNumerador = campoNumerador.text;
                    campoNumerador = campoNumerador * 1;
                    if (campoNumerador > maior) {
                        maior = campoNumerador;
                    }
                }
            }
            //Aumenta um no número anterior
            maior = maior * 1 + 1;
            Xrm.Page.getAttribute(contador).setValue(maior * 1);
            var numeroFormatado = maior.toString();
            if (maior < 10) {
                Xrm.Page.getAttribute(codigoRegistro).setValue('0' + numeroFormatado);
            } else { Xrm.Page.getAttribute(codigoRegistro).setValue(numeroFormatado); }
        }
        else {
            //Primeiro Registro
            Xrm.Page.getAttribute(contador).setValue(1);
            Xrm.Page.getAttribute(codigoRegistro).setValue('01');
        }
    }
}

// Exemplo:      "new_crecenciamento","new_entityenumerada",1,"new_codigo","new_contador"
function autoEnumeradorEntityTopOne(entidade, atributo, parametro, codigoRegistro, contador) {
    if (Xrm.Page.getAttribute(contador).getValue() == 0) {
        var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
    "<entity name=" + entidade + ">" +
    "  <attribute name=" + contador + " />" +
    "  <order attribute=" + contador + " descending='true' />" +
    "    <filter type='and'>" +
    "      <condition attribute=" + atributo + " operator='eq' value=" + parametro + " />" +
    "    </filter>" +
    "</entity>" +
    "</fetch>";
        // Consulta o Codigo registro
        var retrievedEntity = XrmServiceToolkit.Soap.Fetch(fetchXml);
        // Verifica se localizou o Ultimo Contador
        if (retrievedEntity[0].attributes[contador] != null) {
            var campoNumerador = retrievedEntity[0].attributes[contador];
            campoNumerador = parseInt(campoNumerador);
            // Xrm.Page.getAttribute(contador).setValue(campoNumerador);
            //Xrm.Page.getAttribute(codigoRegistro).setValue(campoNumerador.text);
            alert('O ultimo é :' + campoNumerador);
        } else {
            alert('Nao achei');
            //Xrm.Page.getAttribute(contador).setValue(1);
            //Xrm.Page.getAttribute(codigoRegistro).setValue('01');
        }
    }
}

// Exemplo:      "new_planodemovimentacaonavegacao","new_plano",Xrm.Page.getAttribute('new_plano').getValue(),"new_unidadedenegocioid",Xrm.Page.getAttribute('new_unidadedenegocioid').getValue()[0].id,"new_codigo","new_contador"
function autoEnumeradorEntityDouble(entidade, atributo, parametro, atributo1, parametro1, codigoRegistro, contador) {
    if (Xrm.Page.getAttribute(contador).getValue() == 0) {
        var entityRetrive = getEntityNodesDouble(entidade, atributo, parametro, atributo1, parametro1);
        var maior = 0;
        maior = maior * 1;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var campoNumerador = entityNodeRetrive.selectSingleNode("q1:" + contador);
                if (campoNumerador != null) {
                    campoNumerador = campoNumerador.text;
                    campoNumerador = campoNumerador * 1;
                    if (campoNumerador > maior) {
                        maior = campoNumerador;
                    }
                }
            }
            //Aumenta um no número anterior
            maior = maior * 1 + 1;
            Xrm.Page.getAttribute(contador).setValue(maior * 1);
            var numeroFormatado = maior.toString();
            if (maior < 10) {
                Xrm.Page.getAttribute(codigoRegistro).setValue('0' + numeroFormatado);
            } else {
                Xrm.Page.getAttribute(codigoRegistro).setValue(numeroFormatado);
            }
        }
        else {
            //Primeiro Registro
            Xrm.Page.getAttribute(contador).setValue(1);
            Xrm.Page.getAttribute(codigoRegistro).setValue('01');
        }
    }
}

// Exemplo:      "new_planodemovimentacaonavegacao","new_plano",Xrm.Page.getAttribute('new_plano').getValue(),"new_unidadedenegocioid",Xrm.Page.getAttribute('new_unidadedenegocioid').getValue()[0].id,"new_datatexto",Xrm.Page.getAttribute('new_datatexto').getValue(),"new_codigo","new_contador"
function autoEnumeradorEntityTree(entidade, atributo, parametro, atributo1, parametro1, atributo2, parametro2, codigoRegistro, contador) {
    if (Xrm.Page.getAttribute(contador).getValue() == 0) {
        var entityRetrive = getEntityNodesTree(entidade, atributo, parametro, atributo1, parametro1, atributo2, parametro2);
        var maior = 0;
        maior = maior * 1;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var campoNumerador = entityNodeRetrive.selectSingleNode("q1:" + contador);
                if (campoNumerador != null) {
                    campoNumerador = campoNumerador.text;
                    campoNumerador = campoNumerador * 1;
                    if (campoNumerador > maior) {
                        maior = campoNumerador;
                    }
                }
            }
            //Aumenta um no número anterior
            maior = maior * 1 + 1;
            Xrm.Page.getAttribute(contador).setValue(maior * 1);
            var numeroFormatado = maior.toString();
            if (maior < 10) {
                Xrm.Page.getAttribute(codigoRegistro).setValue('0' + numeroFormatado);
            } else {
                Xrm.Page.getAttribute(codigoRegistro).setValue(numeroFormatado);
            }
        }
        else {
            //Primeiro Registro
            Xrm.Page.getAttribute(contador).setValue(1);
            Xrm.Page.getAttribute(codigoRegistro).setValue('01');
        }
    }
}

/*   Pfefixo de Codigo com 000000   */
//Exmplo "new_codigo",6,"","",1
function maskCode(attribute, quantity, prefixo, sufixo, formType) {
    if (statusForm() == formType) {
        var newAttribute = '';
        var oldCode = Xrm.Page.getAttribute(attribute).getValue();
        if (oldCode == null) { oldCode = ""; }
        for (x = 0; x < quantity; x++) {
            newAttribute += '0';
        }
        newAttribute += oldCode;
        newAttribute = newAttribute.substr((newAttribute.length - quantity), quantity);
        newAttribute = prefixo + '' + newAttribute + '' + sufixo;
        Xrm.Page.getAttribute(attribute).setValue(newAttribute);
    }
}

/*   Pega o Id do Usuário Logado no Sistema   */
function GetCurrentUserId() {
    return (Xrm.Page.context.getUserId());
}

/*   Converte de Metros para Pés   */
function metroPesConvert(campoMetro, campoPes, tipoConversao) {
    var pes = Xrm.Page.getAttribute(campoPes).getValue();
    var metro = Xrm.Page.getAttribute(campoMetro).getValue();
    //Metro para Pes
    if (tipoConversao == 1) { if (metro != null) { pes = metro / 0.3048; } }
        //Pes para Metro
    else { if (pes != null) { metro = pes * 0.3048; } }
    Xrm.Page.getAttribute(campoPes).setValue(pes);
    Xrm.Page.getAttribute(campoMetro).setValue(metro);
}

/*   Moastra ou Esconde Campo   */
function VisibletAttribute(attribute, visible) {
    Xrm.Page.getControl(attribute).setVisible(visible);
}

/*   Habilita ou Desabilitar Campo   */
//"new_numerocontrato",true    "new_statuscontrato",true
function EnableDisabletAttribute(attribute, enable) {
    Xrm.Page.getControl(attribute).setDisabled(enable);
}

/*   Habilita ou Desabilitar Campo   */
//"new_numerocontrato",true    "new_statuscontrato",true
function EnableDisableAttribute(attribute, enable) {
    Xrm.Page.getControl(attribute).setDisabled(enable);
}

/*   Altera nivle de requisito do campo   */
// sem restrição (none), recomendado (recommended), obrigatório (required)
function requestLevel(attribute, level) {
    Xrm.Page.getAttribute(attribute).setRequiredLevel(level);
}

/*   /Exibir e Esconder um Sessão   */
// visible (true, false)
function visibleSection(tabName, sectionName, visible) {
    Xrm.Page.ui.tabs.get(tabName).sections.get(sectionName).setVisible(visible);
}

/*   Focar Campo   */
function focusAttibute(attribute) {
    Xrm.Page.getControl(attribute).setFocus(true);
}

/*Prenche com o Guid do Registro */
function retriveGuid(attribute) {
    if (statusForm() != 1) {
        Xrm.Page.getAttribute(attribute).setValue(Xrm.Page.data.entity.getId());
    }
}

/*Esconder dados de um picklist*/
function piclistRemove(attributo, posicao) {
    Xrm.Page.getControl(attributo).removeOption(posicao);
}

/*   Criar Número Serial Randômico   */
//Exemplo "00000-00000-00000-00000-00000", "new_serialnumber"
function criateSerialNumber(mask, attribute) {
    // Gera codigo numerio aleatório
    function GenerateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //Gera codigo alfa numerio aleatório
    function GenerateRandomChar() {
        var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
        var randomNumber = GenerateRandomNumber(0, chars.length - 1);
        return chars[randomNumber];
    }
    // Gera número serial baseado na mascara
    function GenerateSerialNumber(mask) {
        var serialNumber = "";
        if (mask != null) {
            for (var i = 0; i < mask.length; i++) {
                var maskChar = mask[i];
                serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
            }
        }
        Xrm.Page.getAttribute(attribute).setValue(serialNumber);
    }
}

/*   Peenche Unidade de Negócio Autmático com a do Usuário   */
//"new_unidadedenegocio"
function SetaUnidadeDeNegocio(attribute) {
    var entityUserRetrive = getEntityNodes('systemuser', 'systemuserid', GetCurrentUserId());
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
    if (Xrm.Page.getAttribute(attribute).getValue() == null) {
        Xrm.Page.getAttribute(attribute).setValue(lookupData);
    }
}

/*   Retorna Loockup  */
function retrivedLoockup(attributeTable, attributeid, attibuteValue, attributeName, attribute) {
    var entityRetrive = getEntityNodes(attributeTable, attributeid, attibuteValue);
    if (entityRetrive.length != 0) {
        var entityNodeRetrive = entityRetrive[0];
        var name = entityNodeRetrive.selectSingleNode("q1:" + attributeName);
        name = name.text;
        var id = attibuteValue.text;
        var table = attributeTable.text;
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = id;
        lookupItem.typename = table;
        lookupItem.name = name;
        lookupData[0] = lookupItem;
        Xrm.Page.getAttribute(attribute).setValue(lookupData);
    } else {
        Xrm.Page.getAttribute(attribute).setValue(null);
    }
}

/*Retorna o Picklist*/
function retrivedLoockupPicklist(attributeTable, attributeid, attibuteValue, attributeName, attribute) {
    var entityRetrive = getEntityNodes(attributeTable, attributeid, attibuteValue);
    if (entityRetrive.length != 0) {
        var entityNodeRetrive = entityRetrive[0];
        var value = entityNodeRetrive.selectSingleNode("q1:" + attributeName);
        value = value.text;
        Xrm.Page.getAttribute(attribute).setValue(value);
    } else {
        Xrm.Page.getAttribute(attribute).setValue(null);
    }
}

/*   Retorna o Nome Loockup  */
function retrivedLoockupName(attributeTable, attributeid, attibuteValue, attributeName, attribute) {
    var entityRetrive = getEntityNodes(attributeTable, attributeid, attibuteValue);
    if (entityRetrive.length != 0) {
        var entityNodeRetrive = entityRetrive[0];
        var name = entityNodeRetrive.selectSingleNode("q1:" + attributeName);
        name = name.text;
        Xrm.Page.getAttribute(attribute).setValue(name);
    } else {
        Xrm.Page.getAttribute(attribute).setValue(null);
    }
}

/*   Retorna o Nome Loockup  */
function retrivedLoockupName2(attributeTable, attributeid, attibuteValue, attributeName) {
    var entityRetrive = getEntityNodes(attributeTable, attributeid, attibuteValue);
    if (entityRetrive.length != 0) {
        var entityNodeRetrive = entityRetrive[0];
        var name = entityNodeRetrive.selectSingleNode("q1:" + attributeName);
        name = name.text;
        return name;
    } else {
        return null;
    }
}

/*   Acrescentar Data   */
// Exemplo "expireson","new_datadeemissao",Xrm.Page.getAttribute('new_vigenciameses').getValue(),"Mes"
function aumentarData(attribute, campoData, valor, diaMesAno) {
    if ((valor != null) && (Xrm.Page.getAttribute(campoData).getValue() != null)) {
        var primeiradata = Xrm.Page.getAttribute(campoData).getValue();
        if (diaMesAno == 'Dia') {
            primeiradata.setDate(primeiradata.getDate() + valor);
        } else if (diaMesAno == 'Mes') {
            primeiradata.setMonth(primeiradata.getMonth() + valor);
        } else if (diaMesAno == 'Ano') {
            primeiradata.setFullYear(primeiradata.getFullYear() + valor);
        } else if (diaMesAno == 'DiaMenus') {
            primeiradata.setDate(primeiradata.getDate() - valor);
        } else if (diaMesAno == 'MesMenus') {
            primeiradata.setMonth(primeiradata.getMonth() - valor);
        } else if (diaMesAno == 'AnoMenus') {
            primeiradata.setFullYear(primeiradata.getFullYear() - valor);
        }
        Xrm.Page.getAttribute(attribute).setValue(new Date(primeiradata));
    }
}

/*   Preenche o Dia e o Mes conforme uma Data   */
function setDiaMesData(campoDia, campoMes, campoData) {
    if (Xrm.Page.getAttribute(campoData).getValue() != null) {
        var data = Xrm.Page.getAttribute(campoData).getValue();
        Xrm.Page.getAttribute(campoDia).setValue(data.getDate());
        Xrm.Page.getAttribute(campoMes).setValue(data.getMonth() + 1);
    }
}

/*   Registros salvos em Caixa Alta   */
function upperCase() {
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        var attribute = control.getAttribute();
        if (control.getControlType() == "standard") {
            if (attribute && attribute.getAttributeType() &&
                (attribute.getAttributeType() == "string" || attribute.getAttributeType() == "memo")) {
                var valor = attribute.getValue();
                if (valor) {
                    valor = valor.toUpperCase();
                    attribute.setValue(valor);
                }
            }
        }
    }
}

/*   Registros salvos em Caixa Baixa   */
function lowerCase() {
    var controls = Xrm.Page.ui.controls.get();
    for (var i in controls) {
        var control = controls[i];
        var attribute = control.getAttribute();
        if (control.getControlType() == "standard") {
            if (attribute && attribute.getAttributeType() &&
                (attribute.getAttributeType() == "string" || attribute.getAttributeType() == "memo")) {
                var valor = attribute.getValue();
                if (valor) {
                    valor = valor.toLowerCase();
                    attribute.setValue(valor);
                }
            }
        }
    }
}

/*   Registro salvos em Caixa Baixa   */
//"emailaddress1"
function lowerCaseAttribute(attibute) {
    if (Xrm.Page.getAttribute(attibute).getValue() != null) {
        var valor = Xrm.Page.getAttribute(attibute).getValue();
        valor = valor.toLowerCase();
        Xrm.Page.getAttribute(attibute).setValue(valor);
    }
}

/*   Registro salvos em Caixa Alta   */
//"new_name"   "new_modelodeembarcacaoid"  "new_numeroinscricao" "new_areadenavegacao"
function upperCaseAttribute(attibute) {
    if (Xrm.Page.getAttribute(attibute).getValue() != null) {
        var valor = Xrm.Page.getAttribute(attibute).getValue();
        valor = valor.toUpperCase();
        Xrm.Page.getAttribute(attibute).setValue(valor);
    }
}

/*   Valida Data Iníco e Data Fim   */
//"new_datahorainicio","new_datahorafim"
function validaDataInicioDataFim(dataInico, dataFim) {
    var Inicio = Xrm.Page.getAttribute(dataInico).getValue();
    var Fim = Xrm.Page.getAttribute(dataFim).getValue();
    if ((Inicio != null) && (Fim != null)) {
        var DiaInicio = Inicio.getDate();
        var MesInicio = (Inicio.getMonth() + 1);
        var AnoInicio = Inicio.getYear();
        var DiaFim = Fim.getDate();
        var MesFim = (Fim.getMonth() + 1);
        var AnoFim = Fim.getYear();
        if (AnoInicio <= AnoFim) {
            if ((AnoInicio == AnoFim) && (MesInicio > MesFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
            else if ((MesInicio == MesFim) && (DiaInicio > DiaFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
        } else {
            alert('A Data de Fim deve ser maior que a Data de Início');
            Xrm.Page.getAttribute(dataFim).setValue(null);
            focusAttibute(dataFim);
        }
    }
}

/*   Valida Data/Hora Iníco e Data Fim   */
//"new_datahorainicio","new_datahorafim"
function validaDataHoraInicioDataFim(dataInico, dataFim) {
    var Inicio = Xrm.Page.getAttribute(dataInico).getValue();
    var Fim = Xrm.Page.getAttribute(dataFim).getValue();
    if ((Inicio != null) && (Fim != null)) {
        var DiaInicio = Inicio.getDate();
        var MesInicio = (Inicio.getMonth() + 1);
        var AnoInicio = Inicio.getYear();
        var DiaFim = Fim.getDate();
        var MesFim = (Fim.getMonth() + 1);
        var AnoFim = Fim.getYear();
        var HoraInicio = Inicio.getHours();
        var HoraFim = Fim.getHours();
        var MinutoInicio = Inicio.getMinutes();
        var MinutoFim = Fim.getMinutes();

        if (AnoInicio <= AnoFim) {
            if ((AnoInicio == AnoFim) && (MesInicio > MesFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
            else if ((MesInicio == MesFim) && (DiaInicio > DiaFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
            else if ((DiaInicio == DiaFim) && (HoraInicio > HoraFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
            else if ((HoraInicio == HoraFim) && (MinutoInicio > MinutoFim)) {
                alert('A Data de Fim deve ser maior que a Data de Início');
                Xrm.Page.getAttribute(dataFim).setValue(null);
                focusAttibute(dataFim);
            }
        } else {
            alert('A Data de Fim deve ser maior que a Data de Início');
            Xrm.Page.getAttribute(dataFim).setValue(null);
            focusAttibute(dataFim);
        }
    }
}

/*   Filtro de Loockup   */
function filteredLoockup(campoFiltrado, campoFiltro, LoockupSimNao) {
    if ((statusForm() == 1) || (statusForm() == 2)) {
        if (LoockupSimNao == 1) {
            var searchVal = Xrm.Page.getAttribute(campoFiltro).getValue()[0].name;
            if (searchVal != null) {
                Xrm.Page.getAttribute(campoFiltrado).additionalparams = "search=" + searchVal;
            }
        } else if (LoockupSimNao == 9) {
            var searchVal = campoFiltro;
            alert(campoFiltro + searchVal);
            if (searchVal != null) {
                Xrm.Page.getAttribute(campoFiltrado).additionalparams = "search=" + searchVal;
            }
        } else {
            var searchVal = Xrm.Page.getAttribute(campoFiltro).getValue();
            if (searchVal != null) {
                Xrm.Page.getAttribute(campoFiltrado).additionalparams = "search=" + searchVal;
            }
        }
    }
}

/*  Prenche a Unidade do Produto  */
function retriveUomProduct(attributeProduct, attributeUom) {
    if (Xrm.Page.getAttribute(attributeProduct).getValue() != null) {
        var entityRetrive = getEntityNodes('product', 'productid', Xrm.Page.getAttribute(attributeProduct).getValue()[0].id);
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
        Xrm.Page.getAttribute(attributeUom).setValue(lookupData);
    } else {
        Xrm.Page.getAttribute(attributeUom).setValue(null);
    }
}

/*   Forçar Salvamento   */
//Exemplo: "new_salvar" (Campo Bit)
function forceSave(attribute) {
    if (Xrm.Page.getAttribute(attribute).getValue() == true) {
        Xrm.Page.getAttribute(attribute).setValue(false);
    } else {
        Xrm.Page.getAttribute(attribute).setValue(true);
    }
}

/*   Calcular Percentual ou Valor   */
//Exemplo: "new_valorbruto","new_descontopercentual","new_descontovalor",1      "price", "discountpercentage", "discount", 1
function convertPercentValue(attributeValue, attributePercent, attributePercentValue, typeConvert) {
    var valorPercentual = Xrm.Page.getAttribute(attributePercentValue).getValue();
    if (valorPercentual == null) { valorPercentual = 0; }
    var percentual = Xrm.Page.getAttribute(attributePercent).getValue();
    if (percentual == null) { percentual = 0; }
    var valorMoeda = Xrm.Page.getAttribute(attributeValue).getValue();
    if (valorMoeda == null) { valorMoeda = 0; }
    //Percntual --> Valor
    if ((typeConvert == 1) && (percentual > 0) && (percentual <= 100)) {
        valorPercentual = ((valorMoeda * percentual) / 100);
    }
        //Valor --> Perntual
    else if ((typeConvert == 2) && (valorMoeda > 0) && (valorPercentual <= valorMoeda)) {
        percentual = ((valorPercentual / valorMoeda) * 100);
    } else if (valorPercentual > valorMoeda) {
        alert('O desconto não pode ser superior ao Valor Bruto');
        valorPercentual = 0;
        percentual = 0;
    } else {
        valorPercentual = 0;
        percentual = 0;
    }
    Xrm.Page.getAttribute(attributePercent).setValue(percentual);
    Xrm.Page.getAttribute(attributePercentValue).setValue(valorPercentual);
}

/*  Data e Hora Atual  */
function dataHoraAtual(attributo) {
    if (Xrm.Page.getAttribute(attributo).getValue() == null) {
        var dthAgora = new Date();
        Xrm.Page.getAttribute(attributo).setValue(dthAgora);
    }
}
/*   Retorna a Diferença entre Datas   */
function diferencaEntreDatas(dataIncial, dataFinal, tipo) {
    var inicio = Xrm.Page.getAttribute(dataIncial).getValue();
    var fim = Xrm.Page.getAttribute(dataFinal).getValue();
    var resultado = 0;
    //http://www.mspc.eng.br/info/jscriptDataHora.shtml
    if ((inicio != null) && (fim != null)) {
        //Inicio
        var iDia = inicio.getDate();
        var iMes = inicio.getMonth();
        var iAno = inicio.getFullYear();
        var iHora = inicio.getHours();
        var iMinuto = inicio.getMinutes();
        var iSegundo = inicio.getSeconds();
        var iMiliSegundo = inicio.getMilliseconds();
        var iMiliSegundoTotal = Date.UTC(iAno, iMes, iDia, iHora, iMinuto, iSegundo, iMiliSegundo);
        //Fim
        var fDia = fim.getDate();
        var fMes = fim.getMonth();
        var fAno = fim.getFullYear();
        var fHora = fim.getHours();
        var fMinuto = fim.getMinutes();
        var fSegundo = fim.getSeconds();
        var fMiliSegundo = fim.getMilliseconds();
        var fMiliSegundoTotal = Date.UTC(fAno, fMes, fDia, fHora, fMinuto, fSegundo, fMiliSegundo);
        //Conversão de Dados
        var MiliSegundoTotal = fMiliSegundoTotal - iMiliSegundoTotal;
        if (tipo == 'MiliSegundo') {
            resultado = MiliSegundoTotal;
        } else if (tipo == 'Segundo') {
            resultado = (MiliSegundoTotal / 1000);
        } else if (tipo == 'Minuto') {
            resultado = (MiliSegundoTotal / 1000 / 60);
        } else if (tipo == 'Hora') {
            resultado = (MiliSegundoTotal / 1000 / 60 / 60);
        } else if (tipo == 'Dia') {
            resultado = (MiliSegundoTotal / 1000 / 60 / 60 / 24);
        } else if (tipo == 'Mes') {
            resultado = (MiliSegundoTotal / 1000 / 60 / 60 / 24 / 31);
        } else if (tipo == 'Ano') {
            resultado = (MiliSegundoTotal / 1000 / 60 / 60 / 24 / 31 / 365);
        } else {
            resultado = 0;
        }
        return (resultado * 1);
    }
}

/*  Busca Dados Duplicados  
Parametros: entityOne (Entidade Pricipal "account")
            atributeOne (Campo chave de coparação "accountnumber")
            atributeTwo (Campo de Comapração existente na tela onde o codigo será atiado "accountnunber")
            type (Tipo de consulta (1 - Guid  2 - Outros))
*/
function getDuplicateRecord(entityOne, atributeOne, atributeTwo, type) {
    atributeTwoValue = "";
    if (type == 1) {
        atributeTwoValue = Xrm.Page.getAttribute(atributeTwo).getValue()[0].id;
        atributeTwoValue = atributeTwoValue.text;
    } else {
        atributeTwoValue = Xrm.Page.getAttribute(atributeTwo).getValue();
        atributeTwoValue = atributeTwoValue.text;
    }
    var entityRetrive = getEntityNodes(entityOne, atributeOne, atributeTwoValue);
    if (entityRetrive.length != 0) {
        alert("Registro Duplicado!");
        Xrm.Page.getAttribute(atributeTwo).setValue(null);
    }
}

/* Enable/Disable Tab */
function tabdisable(tabname, disablestatus) {
    var tab = Xrm.Page.ui.tabs.get(tabname);
    if (tab == null) alert("Error: The tab: " + tabname + " is not on the form");
    else {
        var tabsections = tab.sections.get();
        for (var i in tabsections) {
            var secname = tabsections[i].getName();
            sectiondisable(secname, disablestatus);
        }
    }
}

/* Enable/Disable Section field  */
function sectiondisable(sectionname, disablestatus) {
    var ctrlName = Xrm.Page.ui.controls.get();
    for (var i in ctrlName) {
        var ctrl = ctrlName[i];
        var ctrlSection = ctrl.getParent().getName();
        if (ctrlSection == sectionname) {
            ctrl.setDisabled(disablestatus);
        }
    }
}

/*  Nome: expandedCollapsed
    Objetivo: Expandir ou Minimizar uma Tab
    Paramentros:    
        tab (numero da tab a ser alterada)
        acao (expanded  collapsed)
    Retorno:
    Exemplo:
        1, 'expanded'   */
function expandedCollapsed(tab, acao) {
    Xrm.Page.ui.tabs.get(tab).setDisplayState(acao);
}

/*  Nome: GetUsuarioLogado
    Objetivo: Retorna o Nome do usuário Logado
    Paramentros: 
    Retorno: String
    Exemplo:
        var NomeDoUsuario = GetUsuarioLogado()   */
function GetUsuarioLogado() {
    var XML = "" +
    "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
    "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
GenerateAuthenticationHeader() +
    " <soap:Body>" +
    " <RetrieveMultiple xmlns=\"http://schemas.microsoft.com/crm/2007/WebServices\">" +
    " <query xmlns:q1=\"http://schemas.microsoft.com/crm/2006/Query\" xsi:type=\"q1:QueryExpression\">" +
    " <q1:EntityName>systemuser</q1:EntityName>" +
    " <q1:ColumnSet xsi:type=\"q1:ColumnSet\">" +
    " <q1:Attributes>" +
    " <q1:Attribute>fullname</q1:Attribute>" +
    " </q1:Attributes>" +
    " </q1:ColumnSet>" +
    " <q1:Distinct>false</q1:Distinct>" +
    " <q1:Criteria>" +
    " <q1:FilterOperator>And</q1:FilterOperator>" +
    " <q1:Conditions>" +
    " <q1:Condition>" +
    " <q1:AttributeName>systemuserid</q1:AttributeName>" +
    " <q1:Operator>EqualUserId</q1:Operator>" +
    " </q1:Condition>" +
    " </q1:Conditions>" +
    " </q1:Criteria>" +
    " </query>" +
    " </RetrieveMultiple>" +
    " </soap:Body>" +
    "</soap:Envelope>" +
    "";
    var xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    xmlHttpRequest.Open("POST", "/mscrmservices/2007/CrmService.asmx", false);
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/crm/2007/WebServices/RetrieveMultiple");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("Content-Length", XML.length);
    xmlHttpRequest.send(XML);
    var resultXml = xmlHttpRequest.responseXML;
    var entityNodes = resultXml.selectNodes("//RetrieveMultipleResult/BusinessEntities/BusinessEntity");
    for (var i = 0; i < entityNodes.length; i++) {
        var entityNode = entityNodes[i];
        var NomeCompletoNode = entityNode.selectSingleNode("q1:fullname");
        var NomeCompleto = (NomeCompletoNode == null) ? null : NomeCompletoNode.text;
    }
    return NomeCompleto;
}


function AddToolTip(controlId, toolTip) {
    var control = document.getElementById(controlId);
    control.ToolTip = toolTip;
    control.attachEvent("onmouseover", ShowToolTip);
    control.attachEvent("onfocus", ShowToolTip);
    control.attachEvent("onmouseout", HideToolTip);
}

function ShowToolTip() {
    var control = event.srcElement;
    TooltipPopup = window.createPopup();
    var ToolTipHTML = "<DIV style='width:100%;height:100%;border:1px solid gray;background-color: #d8e8ff;filter: progid:DXImageTransform.Microsoft.Gradient(GradientType=0,StartColorStr=#ffffff,EndColorStr=#cecfde);padding-left:2px;font:12 px tahoma'>" + control.ToolTip + "</DIV>";
    TooltipPopup.document.body.innerHTML = ToolTipHTML;
    var Width = 400//control.offsetWidth;       
    var Height = 100;
    var Position = GetControlPostion(control);
    var Left = Position.X + 1;
    var Top = Position.Y + 1;
    TooltipPopup.show(Left, Top, Width, Height, null);
}

function GetControlPostion(control) {
    var Position = new Object();
    var controlHeight = control.offsetHeight;
    var iY = 21, iX = -300;
    while (control != null) {
        iY += control.offsetTop;
        iX += control.offsetLeft;
        control = control.offsetParent;
    }
    Position.X = iX + screenLeft;
    Position.Y = iY + screenTop + controlHeight;
    return Position;
}

function HideToolTip() {
    if (TooltipPopup)
        TooltipPopup.hide();
}

//Retorna a URL do Formulário do CRM.
function RetrivedURL() {
    return Xrm.Page.context.getClientUrl();
}

//Fornçar o Fchamento do Fornulário
function ClosedForm() {
    Xrm.Page.ui.close();
}

/* 
    HideRibbonButton("quote|NoRelationship|Form|Mscrm.Form.quote.ActivateQuote-Large");

*/
function HideRibbonButton(nameOfButton) {
    if (window.top.document.getElementById(nameOfButton) != null) {
        window.top.document.getElementById(nameOfButton).style.display = 'none';
    }
}

function ShowRibbonButton(nameOfButton) {
    if (window.top.document.getElementById(nameOfButton) != null) {
        window.top.document.getElementById(nameOfButton).style.display = 'block';
    }
}

/*   Preenche Lista de Preço Ativa  */
function SetDefaultPriceList(attribute) {
    var entityRetrive = getEntityNodes('pricelevel', 'statecode', "Active");
    var entityNodeRetrive = entityRetrive[0];
    var pricelevelId = entityNodeRetrive.selectSingleNode("q1:pricelevelid");
    pricelevelId = pricelevelId.text;
    var name = entityNodeRetrive.selectSingleNode("q1:name");
    name = name.text;
    var lookupData = new Array();
    var lookupItem = new Object();
    lookupItem.id = pricelevelId;
    lookupItem.typename = 'pricelevel';
    lookupItem.name = name;
    lookupData[0] = lookupItem;
    if (Xrm.Page.getAttribute(attribute).getValue() == null) {
        Xrm.Page.getAttribute(attribute).setValue(lookupData);
    }
}

//Preenche Grupo de Unidades e Unidade
function SetDefaultDefaultAndUom(uomSchedule, uom) {
    var entityRetrive = getEntityNodes('uomschedule', 'name', "Área");
    if (entityRetrive.length !== 0) {
        var entityNodeRetrive = entityRetrive[0];
        var id = entityNodeRetrive.selectSingleNode("q1:uomscheduleid");
        id = id.text;
        var name = entityNodeRetrive.selectSingleNode("q1:name");
        name = name.text;
        var lookupData = new Array();
        var lookupItem = new Object();
        lookupItem.id = id;
        lookupItem.typename = 'uomschedule';
        lookupItem.name = name;
        lookupData[0] = lookupItem;
        Xrm.Page.getAttribute(uomSchedule).setValue(lookupData);
        Xrm.Page.getAttribute(uomSchedule).fireOnChange();

        var entityRetriveUom = getEntityNodes('uom', 'name', "M²");
        if (entityRetriveUom.length !== 0) {
            var entityNodeRetriveUom = entityRetriveUom[0];
            var id = entityNodeRetriveUom.selectSingleNode("q1:uomid");
            id = id.text;
            var name = entityNodeRetriveUom.selectSingleNode("q1:name");
            name = name.text;
            var lookupData = new Array();
            var lookupItem = new Object();
            lookupItem.id = id;
            lookupItem.typename = 'uom';
            lookupItem.name = name;
            lookupData[0] = lookupItem;
            Xrm.Page.getAttribute(uom).setValue(lookupData);
            Xrm.Page.getAttribute(uom).fireOnChange();
        }
    }
}

function MakeButton(atrname, textoBotao) {
    if (document.getElementById(atrname) != null) {
        var fieldId = "field" + atrname;
        if (document.getElementById(fieldId) == null) {
            var elementId = document.getElementById(atrname + "_d");
            elementId.innerHTML = '<button id="' + fieldId + '"  type="button" style="width: 120px; height=60px;font:20px;" >' + textoBotao + '</button>';
            elementId.style.height = "60px";
            document.getElementById(fieldId).onclick = function () {
                acaoButton(textoBotao);
            };
        }
    }
}

function DebbugAdministrator() {
    if (currentUserHasRole('Administrador do Sistema') == true) {
        return true;
    } else {
        return false;
    }
}

//É necessário adicionar biblioteca do jquery nos forms que usam esta função
function ChamaServicoAssincrono(url, method, sucessCallback, erroCallBack) {
    var servico = this;
    var parameter = null;
    var obj = new Object();
    servico.SetParameter = function (name, value) {
        if (parameter == null)
            parameter = new Object();
        parameter[name] = value;
    }

    servico.Execute = function () {
        $.ajax({
            cache: false,
            type: "GET",
            url: url + "/" + method,
            data: parameter,
            contentType: "application/javascript",
            jsonpCallback: "svcCallback",
            dataType: "jsonp",
            success: sucessCallback,
            error: erroCallBack
        });
    }
}

function BuscaCepMrvLog(atributoCep, ProcessaRetorno, ProcessaErro) {
    var cep = Xrm.Page.getAttribute(atributoCep).getValue();
    if (cep != null) {
        var cmd = new ChamaServicoAssincrono('/ISV/URBAMAIS/ServicosForms.svc', "ObterEndereco", ProcessaRetorno, ProcessaErro);
        cmd.SetParameter("Cep", cep);
        var result = cmd.Execute();
    }
}

function SetDataDefault(attribute, valor) {
    if (valor != null) {
        var primeiradata = new Date();
        primeiradata.setFullYear(primeiradata.getFullYear() + valor);
        Xrm.Page.getAttribute(attribute).setValue(new Date(primeiradata));
    }
}

function DebbugerConsole(value) {
    if (typeof console != "undefined") {
        console.log(value);
    }
}