/****************************************************************/
/*          Códigos Java Scritp's Entidade SLA                  */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 23/06/2014                                   */
/*          Versão: 2.0                                        */
/****************************************************************/

function onSave_new_sla() {
    if (Xrm.Page.getAttribute("new_assuntoid").getValue() !== null) {
        Xrm.Page.getAttribute("new_name").setValue(Xrm.Page.getAttribute("new_assuntoid").getValue()[0].name);
    }
}

function onLoad_new_sla() {
    if (Xrm.Page.ui.getFormType() == 1)
        Xrm.Page.getControl("new_assuntoid").setDisabled(false);
    else
        Xrm.Page.getControl("new_assuntoid").setDisabled(true);
}

function onChange_new_assuntoid() {
    //Duplicidade do SLA
    if (Xrm.Page.getAttribute("new_assuntoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("new_sla", "new_assuntoid", Xrm.Page.getAttribute("new_assuntoid").getValue()[0].id);
        Xrm.Page.getAttribute("new_name").setValue(Xrm.Page.getAttribute("new_assuntoid").getValue()[0].name);
        if (entityRetrive.length != 0) {
            alert("Registro de SLA Duplicado!");
            Xrm.Page.getAttribute("new_assuntoid").setValue(null);
            Xrm.Page.getAttribute("new_name").setValue("");
        }
    }
    VerificaAssunto();
}

function VerificaAssunto() {
    if (Xrm.Page.getAttribute("new_assuntoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("subject", "subjectid", Xrm.Page.getAttribute("new_assuntoid").getValue()[0].id);
        var entityNodeRetrive = entityRetrive[0];
        var EntidadePrimaria = entityNodeRetrive.selectSingleNode("q1:parentsubject");
        if (EntidadePrimaria == null) {
            alert("Não é possível inserir um Assunto no 1º Nível");
            Xrm.Page.getAttribute("new_assuntoid").setValue(null);
            Xrm.Page.getAttribute("new_name").setValue("");
        }
    }
}
