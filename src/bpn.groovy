import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import groovy.json.JsonOutput

def casuisticas = [:]
casuisticas.a = "¿Esta información fue útil?"
casuisticas.b = "¿Te fue útil mi asistencia?"
casuisticas.c = "¿Resolví tu consulta?"
def conversationId = execution.conversationId().toString()
def metric = customMetricService.getMetric("SUCCESS")
def compareOperativeNull = transientVariableService.getVariable("compareOperativeNull")
def feedbackBinary = [:]
def operativeNull = false
def question = "noFeedBack"
def bpn = "noFeedBack"

def questions(String bpn, Map<Object, String> casuisticas){
    if(bpn.contains("ON_CARDS") || bpn.contains("OFF_CARDS") || bpn.contains("WITHDRAWALCARDLESS")|| bpn.contains("TRANSFERS")){
        return casuisticas.b
    }
    else if (bpn.contains("ACCOUNTSDETAIL") || bpn.contains("EXPENSES") || bpn.contains("MOVEMENTS")|| bpn.contains("BALANCES") || bpn.contains("ACCOUNT_STATUS")){
        return casuisticas.c
    }
    else{
        return casuisticas.a
    }
}
def obtenerJson(String metric){
    def jsonObjects = []
    groups = metric.split("\\|\\|")
    for (group in groups) {
        if(group.contains("[") || group.contains("]")){
            group = group.replace("[", "{").replace("]", "}")  
            group = group.replaceAll(/(\w+): ?([^,}]+)?/, '"$1":"$2"')            
        }
        def slurper = new JsonSlurper()
        def jsonObject = slurper.parseText(group.trim())
        jsonObjects << jsonObject
    }
    def finalJson = JsonOutput.toJson(jsonObjects)
    finalJson = finalJson.replace("\\","" )
    return finalJson
}
def compareOperative(String compareOperativeNull, String finalJson){
    if (compareOperativeNull != null){
        def metric1 = new JsonSlurper().parseText(compareOperativeNull)
        def metric2 = new JsonSlurper().parseText(finalJson)
        if(metric1 == metric2){
            return true
        }
    }
    return false
}

if(metric != null){
    def finalJson = obtenerJson(metric)
    transientVariableService.addVariable("compareOperativeNull", finalJson)
    operativeNull = compareOperative(compareOperativeNull, finalJson)
    if(!operativeNull){
        def datasoruce = new JsonSlurper().parseText(finalJson)  
        for(data in datasoruce) {
            bpn = data.INTENT
        }
        question = questions(bpn, casuisticas)
    }
}

feedbackBinary.question = question
feedbackBinary.operativeBPN = bpn
feedbackBinary.conversationId = conversationId

def questionFeedback = new JsonBuilder(feedbackBinary).toString()
compareOperativeNull = questionFeedback
log.info("%%questionFeedback: " + questionFeedback)  
execution.setVariable("questionFeedback", questionFeedback)