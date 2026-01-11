def format_answer(user_query, enriched_products):
    llm = ChatOpenAI(model=CHEAP_FAST_MODEL, temperature=0.4)
    prompt = load_template("prompts/answer_template.txt")
    return llm.invoke(prompt.format(
        user_query=user_query,
        enriched_products_json=json.dumps(enriched_products)
    ))

# TODO: Also get explantation for choses using the description in the page content