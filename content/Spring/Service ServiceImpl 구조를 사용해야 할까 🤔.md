---
date: 2024-07-26
tags:
  - springboot
  - backend
---

---

# 0. 개요

스프링으로 진행하는 프로젝트를 보면,
`Service` 인터페이스와 `ServiceImpl` 구현체로 나누는 구조가 자주 보이고는 한다.

나 또한 어느 순간부터 이러한 방식으로 구현을 했는데.. 요즘 들어 `왜 이렇게 사용해야 하는지`에 대한 궁금증이 생겨 글을 적어보려고 한다.

## 가. 나는 왜 사용하기 시작했는가?

나는 왜 이러한 구조를 사용을 했는가... 떠올려 보면 프로젝트를 새롭게 시작하면서 같은 파트 팀원이 쓰던 걸 그대로 따라 쓰며 시작했던 것 같다.
그리고 주변에 개발을 하는 친구들도 해당 방식을 많이 사용했기에, 무지성으로 `아 이게 맞는 방식이구나` 싶었던 것 같다 😂

그 당시에는 판별할 능력도 안 되고 왜 쓰는지를 생각하지 않았기 때문에 그랬지만, 이제부터는 조금 더 내가 사용하는 기술들에 대해 이해하고 사용하고 싶다는 마음이 있다!

---

# 1. 인터페이스와 구현체

우선은 `인터페이스` 와 `구현체` 구조에 대해서 한 번 짚고 넘어가 보고자 한다.
 
## 가. 인터페이스

`인터페이스`는 **클래스나 프로그램이 제공해야 하는 동작을 지정하는 방법**을 말한다.
아직 구현되지 않은 추상 메서드만을 가지고 있으며, 여기서는 메서드의 타입 & 메서드명 & 파라미터만 지정하여 메서드를 정의하게 된다.

## 나. 구현체

`구현체`는 **인터페이스에서 정의한 추상 메서드를 실제로 구현한 클래스**를 말한다.
여기서는 인터페이스의 모든 추상 메서드를 구체적으로 구현해야 한다.

하나의 인터페이스에 여러 개의 구현체가 있을 수 있기에, `다형성`을 보장할 수 있다는 장점이 있는데 자세한 내용은 아래에서 작성해보도록 하겠다!

## 다. Service / ServiceImpl 예시

글만 봐서는 이해가 잘 되지 않는다. 코드 예시를 보도록 하자!

### Service 인터페이스

```java
package kusitms.jangkku.domain.persona.application;

import kusitms.jangkku.domain.persona.dto.DefinePersonaDto;
import org.springframework.stereotype.Service;

@Service
public interface DefinePersonaService {
    DefinePersonaDto.DefinePersonaResponse createDefinePersona(String authorizationHeader, DefinePersonaDto.DefinePersonaRequest definePersonaRequest);
    DefinePersonaDto.DefinePersonaResponse createDefinePersonaForSharing(DefinePersonaDto.DefinePersonaRequest definePersonaRequest);
    DefinePersonaDto.DefinePersonaResponse getDefinePersona(String authorizationHeader);
    DefinePersonaDto.DefinePersonaResponse getDefinePersonaForSharing(String definePersonaId);
}
```
위처럼 Service 인터페이스에서는 `1) 메서드 반환 타입 2) 메서드명 3) 파라미터` 만을 지정하여 추상 메서드들을 정의해 준다.

### ServiceImpl 구현체

```java
package kusitms.jangkku.domain.persona.application;

import jakarta.transaction.Transactional;
import kusitms.jangkku.domain.persona.constant.Type;
import kusitms.jangkku.domain.persona.constant.Keyword;
import kusitms.jangkku.domain.persona.dao.DefinePersonaKeywordRepository;
import kusitms.jangkku.domain.persona.dao.DefinePersonaRepository;
import kusitms.jangkku.domain.persona.domain.DefinePersona;
import kusitms.jangkku.domain.persona.domain.DefinePersonaKeyword;
import kusitms.jangkku.domain.persona.dto.DefinePersonaDto;
import kusitms.jangkku.domain.persona.exception.PersonaErrorResult;
import kusitms.jangkku.domain.persona.exception.PersonaException;
import kusitms.jangkku.domain.user.domain.User;
import kusitms.jangkku.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class DefinePersonaServiceImpl implements DefinePersonaService {
    private final JwtUtil jwtUtil;
    private final DefinePersonaRepository definePersonaRepository;
    private final DefinePersonaKeywordRepository definePersonaKeywordRepository;

    // 정의하기 페르소나 결과를 도출하는 메서드 (로그인 유저)
    @Override
    public DefinePersonaDto.DefinePersonaResponse createDefinePersona(String authorizationHeader, DefinePersonaDto.DefinePersonaRequest definePersonaRequest) {
        List<String> definePersonaKeywords = new ArrayList<>();
        String stepOneKeyword = judgeStepOneType(definePersonaRequest.getStageOneKeywords(), definePersonaKeywords);
        String stepTwoKeyword = judgeStepTwoType(definePersonaRequest.getStageTwoKeywords(), definePersonaKeywords);
        String stepThreeKeyword = judgeStepThreeType(definePersonaRequest.getStageThreeKeywords(), definePersonaKeywords);

        String definePersonaCode = stepOneKeyword + stepTwoKeyword + stepThreeKeyword;
        String definePersonaName = judgeDefinePersonaName(definePersonaCode);

        DefinePersona definePersona = saveDefinePersona(authorizationHeader, definePersonaName, definePersonaCode, definePersonaKeywords);

        return DefinePersonaDto.DefinePersonaResponse.of(definePersona.getDefinePersonaId(), definePersona.getCode(), definePersonaKeywords);
    }

    // 정의하기 페르소나 결과를 도출하는 메서드 (비로그인 유저)
    @Override
    public DefinePersonaDto.DefinePersonaResponse createDefinePersonaForSharing(DefinePersonaDto.DefinePersonaRequest definePersonaRequest) {
        List<String> definePersonaKeywords = new ArrayList<>();
        String stepOneKeyword = judgeStepOneType(definePersonaRequest.getStageOneKeywords(), definePersonaKeywords);
        String stepTwoKeyword = judgeStepTwoType(definePersonaRequest.getStageTwoKeywords(), definePersonaKeywords);
        String stepThreeKeyword = judgeStepThreeType(definePersonaRequest.getStageThreeKeywords(), definePersonaKeywords);

        String definePersonaCode = stepOneKeyword + stepTwoKeyword + stepThreeKeyword;
        String definePersonaName = judgeDefinePersonaName(definePersonaCode);

        DefinePersona definePersona = saveDefinePersonaForSharing(definePersonaName, definePersonaCode, definePersonaKeywords);

        return DefinePersonaDto.DefinePersonaResponse.of(definePersona.getDefinePersonaId(), definePersona.getCode(), definePersonaKeywords);
    }

    // 정의하기 페르소나 결과를 반환하는 메서드 (로그인 유저)
    @Override
    public DefinePersonaDto.DefinePersonaResponse getDefinePersona(String authorizationHeader) {
        User user = jwtUtil.getUserFromHeader(authorizationHeader);

        DefinePersona definePersona = definePersonaRepository.findTopByUserOrderByCreatedAtDesc(user); // 가장 최근 결과만 가져옴

        if (definePersona == null) {
            throw new PersonaException(PersonaErrorResult.NOT_FOUND_DEFINE_PERSONA);
        }

        List<DefinePersonaKeyword> definePersonaKeywords = definePersonaKeywordRepository.findAllByDefinePersona(definePersona);
        List<String> keywordStrings = definePersonaKeywords.stream()
                .map(DefinePersonaKeyword::getName)
                .toList();

        return DefinePersonaDto.DefinePersonaResponse.of(definePersona.getDefinePersonaId(), definePersona.getCode(), keywordStrings);
    }

    // 정의하기 페르소나 결과를 반환하는 메서드 (비로그인 유저)
    @Override
    public DefinePersonaDto.DefinePersonaResponse getDefinePersonaForSharing(String definePersonaId) {

        DefinePersona definePersona = definePersonaRepository.findByDefinePersonaId(UUID.fromString(definePersonaId)); // 고유 id로 검색

        if (definePersona == null) {
            throw new PersonaException(PersonaErrorResult.NOT_FOUND_DEFINE_PERSONA);
        }

        List<DefinePersonaKeyword> definePersonaKeywords = definePersonaKeywordRepository.findAllByDefinePersona(definePersona);
        List<String> keywordStrings = definePersonaKeywords.stream()
                .map(DefinePersonaKeyword::getName)
                .toList();

        return DefinePersonaDto.DefinePersonaResponse.of(definePersona.getDefinePersonaId(), definePersona.getCode(), keywordStrings);
    }

... (생략)

}
```

위에서 정의한 추상 메서드들을 실제로 구현하는 코드를 작성한다. 
`@Override` 어노테이션을 필수적으로 붙여야 한다.
당연히 **반환 타입, 메서드명, 파라미터는 동일해야 하며, 그 외에는 자유롭게 기능을 구현할 수 있다.**

---

# 2. 사용하는 이유

어느정도 구조에 대해서는 이해가 되었기에, 지금부터는`도대체 왜 사용하는 것인지`에 대해 얘기해보고자 한다.

## 가. 다형성

다형성이란, **같은 이름의 메서드나 연산자가 다른 동작을 하는 것**을 말한다.

하나의 인터페이스에 대해 여러 개의 구현체를 둔다면, 메서드의 이름은 같지만 클래스에 맞는 동작을 하도록 구현할 수 있다.

아래의 코드 예시를 한 번 보자.

### PaymentService 인터페이스

```java
public interface PaymentService {
    void processPayment(double amount);
}
```

인터페이스에서 결제를 진행하는 기능의 추상 메서드를 정의해준다.

### CreditCardPaymentService 구현체

```java
// 첫 번째 구현체 - 신용카드 결제 서비스
@Service
public class CreditCardPaymentService implements PaymentService {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of " + amount);
        // 신용카드 결제 로직
        if (validateCardDetails()) {
            chargeCreditCard(amount);
            System.out.println("Credit card payment successful.");
        } else {
            System.out.println("Credit card validation failed.");
        }
    }
}
```

첫 번째 구현체에서는 신용카드 결제를 진행할 수 있도록 기능을 구현한다.

### PaypalPaymentService 구현체

```java
// 두 번째 구현체 - 페이팔 결제 서비스
@Service
public class PaypalPaymentService implements PaymentService {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment of " + amount);
        // 페이팔 결제 로직
        if (authenticatePaypalAccount()) {
            executePaypalPayment(amount);
            System.out.println("PayPal payment successful.");
        } else {
            System.out.println("PayPal authentication failed.");
        }
    }
}
```

두 번째 구현체에서는 페이팔 결제를 진행할 수 있도록 기능을 구현한다.
이처럼 동일한 `processPayment` 라는 이름의 메서드이지만, 완전히 다른 동작을 하도록 구현할 수 있는 것이다.

## 나. OCP (개방 폐쇄의 원칙)

`OCP`는 객체 지향 설계 5대 원칙인 `SOLID 원칙` 중 하나로, 
**클래스, 모듈, 함수 등은 확장에는 열려 있어야 하고, 변경에는 닫혀 있어야 한다는 것**을 의미한다.

새로운 기능을 추가할 때 기존 코드를 수정하지 않고도 기능을 확장할 수 있어야 한다는 뜻이며, 이를 통해 유연성이 높아지고 유지보수가 용이해진다.

위에서 작성한 결제 서비스의 경우를 이어서 예시를 들어보도록 하겠다.

### PaymentProcessor

```java
// PaymentProcessor 클래스 - 결제 처리기, 다양한 결제 서비스를 처리할 수 있음
public class PaymentProcessor {
    private PaymentService paymentService;

    // 결제 서비스를 주입받는 생성자
    public PaymentProcessor(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 결제 처리 메서드
    public void process(double amount) {
        paymentService.processPayment(amount);
    }
}
```

결제 서비스를 주입 받아, 다양한 결제 서비스를 처리할 수 있는 `PaymentProcessor` 가 있다. 해당 클래스는 `PaymentService` 인터페이스에 의존하여 결제를 처리한다.

현재는 1) 신용카드와 2) 페이팔 결제 서비스만 존재하기에, 
아래와 같이 3) 은행 이체 결제 서비스도 추가를 해보도록 하겠다.

### BankTransferPaymentService 구현체

```java
// 세 번째 구현체 - 은행 이체 결제 서비스
public class BankTransferPaymentService implements PaymentService {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing bank transfer payment of " + amount);
        // 은행 이체 결제 로직
    }
}
```

첫 번째, 두 번째와 동일한 방식으로 구현체 클래스를 만들어 새로운 기능을 제공할 수 있게 되었다. 

이 기능은 물론 `PaymentProcessor` 에서도 바로 사용할 수가 있다.
여기서 중요한 점은, `PaymentProcessor` 의 코드는 하나도 변경된 점이 없다는 것이다.

하지만 만약에 `인터페이스-구현체` 구조가 아니라, `Service` 에 바로 메서드들을 구현했다면 어떻게 되었을까?

각 기능에 따라 메서드명이 달라졌을 것이고, 그렇다면 지금처럼 `processPayment` 라는 1개의 메서드로 간편하게 호출하기는 불가능해진다.

또한 네 번째 새로운 결제 기능이 추가된다면, `PaymentProcessor` 에서도 해당 기능을 사용하기 위해 코드를 추가해야 할 것이다.

이러한 점에서 인터페이스-구현체는, OCP 원칙을 준수할 수 있는 구조라 할 수 있다.

## 다. AOP Proxy

우선 `AOP(Aspect Oriented Programing)`란 관점지향형 프로그래밍이다.
이는 반복 사용되는 로직들을 모듈화 하여 필요할때 호출해서 사용하는 방법으로, 대표적으로 `Transaction`이 AOP관점이 적용되는 사례라 볼 수 있다.

과거 스프링에서는 AOP를 구현하기 위해서`JDK Dynamic Proxy`를 사용했다고 한다. 
`JDK Dynamic Proxy`가 프록시 객체를 생성하려면 인터페이스가 필수적이었는데,
즉 AOP가 사용되는 `@Transactional` 어노테이션 등이 동작하기 위해서는 인터페이스 - 구현체 구조를 사용해야만 했던 것이다.

하지만 Spring 3.2 / Spring Boot 1.4 버전부터는 `CGLIB`를 기본적으로 포함하게 되었는데, `CGLIB`는 클래스의 서브클래스를 동적으로 생성하여 프록시를 만들어주기에 인터페이스를 구현하지 않은 클래스에도 적용할 수 있었다.

즉, 더 이상 스프링에서 AOP를 구현하기 위해서 인터페이스 - 구현체 구조를 사용해야 할 이유는 사라진 것이다.

필요성은 없어졌지만, 이전의 관습이 그대로 이어지며 해당 구조가 고착화되었다는 의견이 다수 존재한다.

---

# 3. 여전히 사용해야 하는가?

이에 대해서는 아직도 많은 의견들이 존재한다.
가장 대표적으로 나뉘는 주장이 아래의 2가지인 듯하다.
`1:1로 구현할 것이라면 필요 없다.` 🆚 `미래의 확장 가능성을 고려하여 사용해야 한다.`

## 가. 1:1로 구현할 것이라면 필요 없다.

인터페이스-구현체 구조를 정말 잘 활용한 프로젝트도 있겠지만, 지금까지 내가 보아온 대부분의 프로젝트에서는 1:1로 구현을 했었다.
그렇다면 OCP 원칙은 잘 지킬 수 있겠지만, 다형성에서의 이점은 하나도 존재하지 않는다.

그리고 대개 `UserService-UserServiceImpl` 과 같이 인터페이스와 동일한 이름 뒤에 `Impl`만 붙여 작명하곤 하는데, 이는 확장 가능성을 고려한 것도 아닐 뿐더러 정확히 어떤 동작을 위한 구현체인지 알 수가 없다.

반면 자주 사용하는 `List-ArrayList,LinkedList` 도 인터페이스-구현체 구조인데, 이 둘은 이름을 보고 어떻게 구현되었는지 감을 잡을 수 있다.

## 나. 미래의 확장 가능성을 고려하여 사용해야 한다.

위와 다르게, 미래의 확장 가능성을 고려해 사용해야 한다는 의견도 다수 존재한다.

`과연 확장될 가능성이 있는가?`를 고려하기 위해서는 도메인에 대한 이해가 필수적으로 필요하기에, 내부적으로도 많은 논의를 거쳐야 하는 부분이다.

---

# 4. 결론

결론적으로 나는 `앞으로 인터페이스-구현체 구조를 사용하지 않을 것`이다.

만약 1:1 구현이라면 해당 구조를 사용하며 얻을 수 있는 이점이 거의 존재하지 않아,
`왜 이러한 구조를 사용했는가?` 라는 부분에서 설득력이 떨어지기 때문이다.

물론 1:N 으로 구현을 할 상황이라면 사용하는 것이 옳다고 생각하므로, 기획 및 설계 시에 고민해 보고 결정해야할 것 같다.

(ps. 앞으로도 생각 없이 코드를 따라 치지 않도록, 항상 의문점을 가지고 공부를 진행해야겠다🔥)
