You are an expert quiz generator and content specialist for news articles. Your task is to create challenging quiz questions based on provided German news articles from tagesschau.de.

For each article, you must formulate exactly one difficult question. The question itself should be general in wording, without directly referring to 'the article' or 'this text'. However, it must still be specific enough that only someone who has thoroughly read the *corresponding* article can answer it correctly, targeting a specialist-level understanding of that article's content, not general knowledge.

You will also provide three plausible answer options (A, B, C) for each question. Only one of these options must be correct according to the content of the article.

Your output MUST be a JSON array of quiz question objects, strictly adhering to the following schema:

```json
[
  {
    "id": "url_of_article",
    "question": "generated_question_text",
    "answers": {
      "a": "answer_option_a_text",
      "b": "answer_option_b_text",
      "c": "answer_option_c_text"
    },
    "correct_answer": "a" | "b" | "c"
  }
]
```

Here is an example of an input article and the corresponding desired output format:

---
**Input Article Example:**
```json
    {
        "url": "https://www.tagesschau.de/inland/meldung-ts-2056.html",
        "date": "2007-01-01",
        "headline": "Interview mit ARD-Wetterexpertin Silke Hansen\"Alle Zeichen standen bei 'Kyrill' auf Sturm\"",
        "sub_headline": "Selten wurde im Vorwege so intensiv vor einem Sturm gewarnt, wie vor dem Orkantief \"Kyrill\". Haben wir es von nun an öfter mit Stürmen dieser Stärke zu tun? Ist der Klimawandel schuld?tagesschau.desprach darüber mit der ARD-Wetterexpertin Silke Hansen.",
        "paragraphs": [
            "Selten wurde im Vorwege so intensiv vor einem Sturm gewarnt, wie vor dem Orkantief \"Kyrill\". Haben wir es von nun an öfter mit Stürmen dieser Stärke zu tun? Ist der Klimawandel schuld? tagesschau.de sprach darüber mit der ARD-Wetterexpertin Silke Hansen.",
            "tagesschau.de:Frau Hansen, Sie haben die Nacht in 880 Metern Höhe im Hotel „Feldberghof“ auf einem Plateau verbracht. Wie war das?",
            "Silke Hansen:Oh je, ich habe vielleicht gerade mal eine halbe Stunde geschlafen. Schon gestern Abend klapperten die Dachziegel, und das Fenster in meinem Zimmer hat so vibriert, dass ich dachte, der Sturm würde es jeden Moment eindrücken. Zum Glück ist das Gebäude nicht von Bäumen umgeben. Sonst hätte ich noch viel mehr Angst gehabt.",
            "tagesschau.de:Es ist selten im Vorfeld so intensiv vor einem Sturm wie diesem gewarnt worden. Warum?",
            "Hansen:\"Kyrill\" war ein wirklich außergewöhnlicher Sturm. Normalerweise betrifft ein Sturm nur Teile des Landes, wie zum Beispiel bei Orkan \"Lothar\" im Südwesten Deutschlands. Aber \"Kyrill\" hat ganz Deutschland erwischt. Auf den Wetterkarten konnte man die Spitzenböen deutlich sehen. Normalerweise sind dreistellige Spitzenböen nur oben auf den Bergen zu verzeichnen. Ab und zu findet man mal eine in den Tälern. Gestern hingegen gab es in ganz Deutschland keinen Ort, wo nicht wenigstens 100 Kilometer pro Stunde erreicht wurden.",
            "tagesschau.de:Seit wann wussten Sie vom Herannahen \"Kyrills\"?",
            "Hansen:Ich habe den Sturm seit etwa anderthalb Wochen verfolgt. \"Kyrill\" war schon seit Tagen in jedem Computermodell der weltweiten Wetterdienste drin. So genannte Modellläufe des Wetters gibt es alle sechs bis zwölf Stunden. Da unser Computer die Werte immer und immer wieder berechnete, wurde uns schnell klar, dass alle Zeichen auf Sturm gesetzt waren. Deshalb haben wir auch so frühzeitig gewarnt. Ich selbst war zusätzlich alarmiert, weil all unsere Meteorologen gestern früh nach Hause wollten. Und wenn unsere Experten schon so unruhig werden, dann wird es heftig.",
            "tagesschau.de:Bei einer Befragung unserer Usern haben gestern mehr als 70 Prozent angegeben, sie glaubten, dass \"Kyrill\" eine Folge des Klimawandels sei. Was ist Ihre Meinung dazu?",
            "Hansen:Ganz schwer zu sagen. Es gibt tatsächlich für beide Theorien gute Argumente. Sowohl für diejenigen, die sagen, das ist erst der Anfang dessen, worauf wir uns einstellen müssen, aber auch für solche, die sagen: So was hat es immer gegeben und wird es immer geben. \"Kyrill\" ist in diesen großen Zyklen nur eine Laune der Natur. Ich persönlich kann beiden Erklärungen etwas abgewinnen.",
            "tagesschau.de:Das Wetter in diesem Winter ist extrem mild. Begünstigen solche Temperaturen das Entstehen von Stürmen?",
            "Hansen:Nein, anders herum wird ein Schuh draus. Das milde Wetter ist eine Folge des Sturmes. Weil es in den letzten Monaten so viele Tiefdruckgebiete im Westen gab, die sehr stürmisch waren, brachten diese die milde Luft aus dem Mittelmeerraum direkt zu uns nach Deutschland. Normal bei so einer Wetterlage wäre, dass die Luft langsam angewabert kommt. Tiefdruckgebiete sind nämlich in der Regel nicht sehr schnell. Bis sie bei uns sind, haben sie sich abgekühlt. In diesem Fall aber kamen viele Tiefdruckgebiete mit Sturm zu uns. Deshalb ist es zur Zeit so mild.",
            "tagesschau.de:Wird es in diesem Winter noch weitere solcher Stürme geben?",
            "Hansen:Nein, eher nicht. So unwahrscheinlich, wie dieser Sturm war, so unwahrscheinlich sind die nächsten auch. Wir haben uns gestern die Stürme der letzten zwanzig, dreißig Jahre angeschaut. \"Kyrill\" kann man guten Gewissens unter die Top fünf rechnen.",
            "tagesschau.de:Wie geht es mit \"Kyrill\" weiter? Gibt es jetzt Entwarnung?",
            "Hansen:Nein, es klingt erst mal toll, wenn man hört, dass sich der Sturm im Laufe des Tages abschwächt. Aber wir liegen immer noch bei Böen von 80 bis 90 Kilometern pro Stunde. Das reicht, um Dachziegel herunterzuholen und Bäume zu entwurzeln. Zumal der Boden vom vielen Regen sehr aufgeweicht ist und die Bäume locker drinstehen. Außerdem kommt morgen ein neues Sturmtief. In der Nacht wird es an der Küste Schleswig-Holsteins dann neue Orkanböen geben.",
            "Die Fragen stellte Claudia Ulferts, tagesschau.de."
        ]
    },
```

**Output Question Example (following the schema):**
```json
  {
    "id": "https://www.tagesschau.de/inland/meldung-ts-2056.html",
    "question": "Welche spezifische Gegebenheit am Standort des Hotels „Feldberghof“ trug laut der ARD-Wetterexpertin Silke Hansen dazu bei, dass ihre Sorge um die Sicherheit des Gebäudes während des Orkantiefs „Kyrill“ trotz starker Vibrationen begrenzt blieb?",
    "answers": {
      "a": "Die moderne Stahlbetonbauweise und die tiefgehende Fundamentverankerung auf dem Plateau.",
      "b": "Die Tatsache, dass sich in der unmittelbaren Umgebung des Gebäudes kein Baumbestand befand.",
      "c": "Die Montage spezieller Sturmsicherungen an den Fenstern, die einen Glasbruch verhinderten."
    },
    "correct_answer": "b"
  },
```
---

Now, process the following JSON input containing articles and generate the quiz questions in the specified JSON format.
It is crucial, that you formulate one question for every article and use the exact URL string for the ID string.
Make absolutely sure, that you follow these instructions.

{tagesschau_articles.json}